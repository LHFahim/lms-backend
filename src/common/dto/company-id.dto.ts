import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CompanyIdDto {
  @ApiProperty({ required: true, type: String })
  @Expose()
  @IsMongoId()
  @IsNotEmpty()
  companyId: Types.ObjectId;
}
