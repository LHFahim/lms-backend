import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@typegoose/typegoose';
import { Expose, Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class DocumentCT {
    @ApiProperty({ name: 'id', type: String })
    // @ObjectID()
    @Expose({ name: 'id' })
    @IsString()
    @Type(() => Types.ObjectId)
    @Transform((params) => params.obj._id.toString())
    _id?: Types.ObjectId;
}

export class DocumentCTWithTimeStamps extends DocumentCT {
    @Prop({ required: false, type: Date })
    @Expose()
    public createdAt?: Date;

    @Prop({ required: false, type: Date })
    @Expose()
    public updatedAt?: Date;
}
