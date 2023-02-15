import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Model } from '../../../libs/utils/src';
import { UserEntity } from '../../user/entities/user.entity';
import { DocumentCTWithTimeStamps } from './../../../libs/utils/src/serializer/defaultClasses';

export enum TodoEnum {
    DEFAULT = 'DEFAULT',
}

@Model('todos', true)
export class TodoEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Prop({ required: true })
    @ApiProperty({ required: true })
    title: string;

    @Expose()
    @IsString()
    @Prop({ required: true })
    @ApiProperty({ required: true })
    description: string;

    @Expose()
    @IsBoolean()
    @Prop({ required: true })
    @ApiProperty({ required: true })
    completed: boolean;

    @Expose()
    @IsNotEmpty()
    @IsEnum(TodoEnum)
    @Prop({ required: true, default: TodoEnum.DEFAULT })
    @ApiProperty({ required: true, default: TodoEnum.DEFAULT })
    type: TodoEnum;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    createdBy: Ref<UserEntity>;

    @Expose()
    @IsBoolean()
    @Prop({ required: true, default: false })
    @ApiProperty({ required: false })
    isDeleted: boolean;
}
