import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { DiscussionEntity } from '../entities/discussion.entity';

export class CreateDiscussionDto extends PickType(DiscussionEntity, []) {
    @Expose()
    @IsMongoId()
    @ApiProperty({ required: true })
    book: string;
}

export class UpdateDiscussionDto extends OmitType(CreateDiscussionDto, []) {}

// response
export class DiscussionDto extends DiscussionEntity {}
