import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum Sort {
    ASC = 'asc',
    DESC = 'desc',
}

export class PaginationPageOnlyQueryDto {
    @ApiProperty({ required: false, default: 1 })
    @Expose()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number;

    @ApiProperty({ required: false, default: 20 })
    @Expose()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    pageSize: number;
}

export class PaginationQueryDto extends PaginationPageOnlyQueryDto {
    @ApiProperty({ required: false })
    @Expose()
    @IsOptional()
    @IsString()
    search: string;

    @ApiProperty({ required: false, default: 'createdAt' })
    @Expose()
    @IsOptional()
    @IsString()
    sortBy: string;

    @ApiProperty({ enum: Sort, required: false, default: Sort.DESC })
    @Expose()
    @IsOptional()
    @IsEnum(Sort)
    sort: Sort;
}
