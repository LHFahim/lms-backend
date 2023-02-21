import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Model } from '../../../../libs/utils/src';
import { BookTagsEnum, CurrencyEnum } from '../../../common/enums/lms.enum';
import { UserEntity } from '../../../user/entities/user.entity';

import { DocumentCTWithTimeStamps } from './../../../../libs/utils/src/serializer/defaultClasses';

@Model('books', true)
export class BookEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    title: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @Prop({ required: true, trim: true })
    author: string;

    @Expose()
    @IsEnum(BookTagsEnum, { each: true })
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ required: true, isArray: true, enum: BookTagsEnum })
    @Prop({ required: true, default: BookTagsEnum.ACADEMIC })
    tags: BookTagsEnum[];

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    description: string;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: false, minimum: 0 })
    @Prop({ required: false, trim: true, min: 0 })
    cost: number;

    @Expose()
    @IsEnum(CurrencyEnum)
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @Prop({ required: false })
    currency: CurrencyEnum;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, minimum: 0 })
    @Prop({ required: true, trim: true, min: 0 })
    quantity: number;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    image: string;

    @Expose()
    @IsArray()
    @ApiProperty({ required: true })
    @Prop({ required: true, default: [] })
    @IsMongoId({ each: true })
    borrowedBy: Ref<UserEntity>[];

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    isAvailable: boolean;

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    isDeleted: boolean;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    addedBy: Ref<UserEntity>;
}

// [{
//     "title": "C++",
//     "author": "Fahim",
//     "tags": [
//       "ACADEMIC",
//       "SCI-FI"
//     ],
//     "description": "Great book on C++",
//     "quantity": 89,
//     "image": "https://blog-c7ff.kxcdn.com/blog/wp-content/uploads/2017/03/Bjarne-Stroustrup.jpg"
//   },{
//     "title": "The Lord of the Rings",
//     "author": "J. R. R. Tolkien",
//     "category": [
//       "FANTASY"
//     ],
//     "description": "The Lord of the Rings is an epic high-fantasy novel by English author and scholar J. R. R. Tolkien. Set in Middle-earth, the story began as a sequel to Tolkien's 1937 children's book The Hobbit, but eventually developed into a much larger work.",
//     "quantity": 88,
//     "image": "https://s26162.pcdn.co/wp-content/uploads/2017/05/the-lord-of-the-rings-book-cover.jpg"
//   },{
//     "title": "Practical Nest.js Guide",
//     "author": "Daniel Correa",
//     "tags": [
//       "ACADEMIC"
//     ],
//     "description": "Nest.js is a framework for building efficient, scalable Node.js server-side applications. We will use Nest.js to develop an Online Store application that uses several Nest.js features. The Online Store application will be the means to understand straightforward and complex Nest.js concepts and how Nest.js features and third-party libraries can be used to implement clean MVC web applications.",
//     "quantity": 50,
//     "image": "https://m.media-amazon.com/images/I/41artx009UL.jpg"
//   },{
//     "title": "Programming TypeScript",
//     "author": "Boris Cherny",
//     "tags": [
//       "ACADEMIC"
//     ],
//     "description": "Any programmer working with a dynamically typed language will tell you how hard it is to scale to more lines of code and more engineers. That’s why Facebook, Google, and Microsoft invented gradual static type layers for their dynamically typed JavaScript and Python code. This practical book shows you how one such type layer, TypeScript, is unique among them: it makes programming fun with its powerful static type system.",
//     "quantity": 50,
//     "image": "https://m.media-amazon.com/images/P/1492037656.01._SCLZZZZZZZ_SX500_.jpg"
//   },{
//     "title": "The Hunger Games",
//     "author": "Suzanne Collins",
//     "tags": [
//       "ADVENTURE",
//       "SCI-FI"
//     ],
//     "description": "In the nation of Panem, established in the remains of North America after an unspecified apocalyptic event, the wealthy Capitol exploits the twelve surrounding districts for their natural resources and labor. District 12 is in the coal-rich region that was once Appalachia, while the Capitol is west of the Rocky Mountains. As punishment for a past failed rebellion against the Capitol, which resulted in the obliteration of District 13, one boy and one girl between the ages of 12 and 18 from each of the 12 remaining districts are selected by an annual lottery to participate in the Hunger Games, a contest in which the tributes must fight to the death in an outdoor arena until only one remains.",
//     "quantity": 50,
//     "image": "https://upload.wikimedia.org/wikipedia/en/d/dc/The_Hunger_Games.jpg"
//   }]
