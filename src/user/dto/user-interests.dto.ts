import { UserInterestsEntity } from '../entities/user-interests.entity';

export class UserInterestsDto extends UserInterestsEntity {}
// export class RecommendedDto extends UserInterestsEntity {
//     @Expose()
//     @IsMongoId()
//     @IsNotEmpty()
//     @Type(() => BookEntity)
//     @Prop({ required: true, ref: () => BookEntity })
//     prevBook: Ref<BookEntity>;
//     @Expose()
//     @IsMongoId()
//     @IsNotEmpty()
//     @Type(() => BookEntity)
//     @Prop({ required: true, ref: () => BookEntity })
//     recommendedBook: Ref<BookEntity>;
// }
