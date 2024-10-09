import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class MultiFileValidationPipe implements PipeTransform {
  private readonly allowedTypes: string[];
  private readonly maxSize: number;
  private readonly isMultiple: boolean;

  constructor(allowedTypes: string[], maxSize: number, isMultiple = false) {
    this.allowedTypes = allowedTypes;
    this.maxSize = maxSize;
    this.isMultiple = isMultiple;
  }

  transform(
    files: Express.Multer.File | Express.Multer.File[],
  ): Express.Multer.File | Express.Multer.File[] {
    if (this.isMultiple) {
      if (!Array.isArray(files) || files.length === 0) {
        throw new BadRequestException('At least one file is required');
      }

      files.forEach((file) => this.validateFile(file));
    } else {
      if (!files) {
        throw new BadRequestException('File is required');
      }

      this.validateFile(files as Express.Multer.File);
    }

    return files;
  }

  private validateFile(file: Express.Multer.File) {
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
  }
}
