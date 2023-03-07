import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import { DocumentCTWithTimeStamps, Model } from '../../../libs/utils/src';
import { BookEntity } from '../../admin/admin-book/entities/admin-book.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Model('waiting-list', true)
export class WaitingListEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => BookEntity)
    @Prop({ required: true, ref: () => BookEntity })
    book: Ref<BookEntity>;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    user: Ref<UserEntity>;

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, default: false, trim: true })
    isEmailed: boolean;
}
