import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedTypes: string[];
  private readonly maxSize: number;

  constructor(allowedTypes: string[], maxSize: number) {
    this.allowedTypes = allowedTypes;
    this.maxSize = maxSize;
  }

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Check file type
    const fileExt = extname(file.originalname).toLowerCase();
    if (!this.allowedTypes.includes(fileExt)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types are: ${this.allowedTypes.join(', ')}`,
      );
    }

    // Check file size
    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `File size exceeds the limit of ${this.maxSize / (1024 * 1024)} MB`,
      );
    }

    return file;
  }
}

export const createFileFilter = (allowedTypes: string[], maxSize: number) => {
  return (
    req: any,
    file: Express.Multer.File,
    callback: (error: any, acceptFile: boolean) => void,
  ) => {
    const fileExt = extname(file.originalname).toLowerCase();

    if (!allowedTypes.includes(fileExt)) {
      return callback(
        new BadRequestException(
          `Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`,
        ),
        false,
      );
    }

    if (file.size > maxSize) {
      return callback(
        new BadRequestException(
          `File size exceeds the limit of ${maxSize / (1024 * 1024)} MB`,
        ),
        false,
      );
    }

    callback(null, true);
  };
};
