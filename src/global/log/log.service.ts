import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from 'src/schemas/logs.schema';
import { LogDto } from './log.dto';
import { LogType } from 'src/constants/constents';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) { }


  async getAllLogs(page = 1, limit = 40, search = '') {
    const skip = (page - 1) * limit;

    const matchStage = {
      $match: {
        ...(search
          ? { 'userData.name': { $regex: search, $options: 'i' } }
          : {}),
      },
    };

    const pipeline = [
      {
        $addFields: {
          userObjectId: { $toObjectId: '$user' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $unwind: '$userData',
      },
      matchStage,
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const data = await this.logModel.aggregate(pipeline as any);

    const totalCountPipeline = [
      {
        $count: 'totalCount',
      },
    ];

    const totalCountResult = await this.logModel.aggregate(totalCountPipeline);
    const totalCount = totalCountResult.length
      ? totalCountResult[0].totalCount
      : 0;

    return {
      data,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }


  async getAllClicks(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    const matchStage = {
      $match: {
        type: LogType.CLICK_ACTIVITY,
        ...(search
          ? { 'userData.name': { $regex: search, $options: 'i' } }
          : {}),
      },
    };

    const pipeline = [
      {
        $addFields: {
          userObjectId: { $toObjectId: '$user' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $unwind: '$userData',
      },
      matchStage,
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const data = await this.logModel.aggregate(pipeline as any);

    const totalCountPipeline = [
      {
        $match: { type: LogType.CLICK_ACTIVITY },
      },
      {
        $count: 'totalCount',
      },
    ];

    const totalCountResult = await this.logModel.aggregate(totalCountPipeline);
    const totalCount = totalCountResult.length
      ? totalCountResult[0].totalCount
      : 0;

    return {
      data,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async getUserLogs(id: string) {
    return await this.logModel.find({ user: id }).sort({ createdAt: -1 });
  }

  async createNewLog(data: LogDto) {
    try {
      return await this.logModel.create({
        ...data,
        timeQuery: this.getFullDateTimeInfo(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  private getFullDateTimeInfo() {
    const now = new Date();

    // Map for full and short day names
    const fullDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const shortDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayIndex = now.getDay();
    const fullDayName = fullDays[dayIndex]; // Full day name (e.g., "Monday")
    const shortDayName = shortDays[dayIndex]; // Short day name (e.g., "MON")

    // Map for full and short month names
    const fullMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const shortMonths = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    const monthIndex = now.getMonth();
    const fullMonthName = fullMonths[monthIndex];
    const shortMonthName = shortMonths[monthIndex];

    const dayOfMonth = now.getDate();
    const year = now.getFullYear();
    const hour = now.getHours() % 12 || 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

    return {
      dayName: {
        full: fullDayName, // Full day name
        short: shortDayName, // Short day name
      },
      monthName: {
        full: fullMonthName, // Full month name
        short: shortMonthName, // Short month name
      },
      dayOfMonth: dayOfMonth, // Day of the month
      year: year, // Year
      hour: hour, // Hour in 12-hour format
      minute: minute, // Minute
      second: second, // Second
      ampm: ampm, // AM or PM
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Timezone
    };
  }
}
