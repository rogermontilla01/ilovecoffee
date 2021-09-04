import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const newValue = parseInt(value, 10)
    if (isNaN(newValue)) throw new BadRequestException(`Validation failed, "${newValue}" is not an integer`)
    return newValue;
  }
}
