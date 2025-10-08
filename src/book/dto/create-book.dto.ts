import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from "../schemas/book.schema";
import mongoose from "mongoose";


export class CreateBookDto {
    @ApiProperty({ example: 'The Great Gatsby' })
    @IsNotEmpty()
    @IsString()
    readonly title: string;


    // @IsNotEmpty()
    // @IsMongoId()
    // readonly author: mongoose.Types.ObjectId;

    @ApiPropertyOptional({ example: 'A classic novel' })
    @IsOptional()
    @IsNotEmpty()
    readonly description?: string;

    @ApiPropertyOptional({ example: 19.99 })
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    readonly price?: number;

    @ApiProperty({ enum: Category })
    @IsNotEmpty()
    @IsEnum(Category)
    readonly category?: Category;
}
