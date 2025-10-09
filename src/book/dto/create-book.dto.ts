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

    @ApiPropertyOptional({ example: 'http://example.com/thumbnail.jpg' })
    @IsOptional()
    @IsString()
    readonly thumbnailUrl?: string;

    @ApiPropertyOptional({ example: 4.5, description: 'Average rating (0-5)' })
    @IsOptional()
    @IsNumber()
    readonly rating?: number;

    @ApiPropertyOptional({ example: 5, description: 'Number of reviews' })
    @IsOptional()
    @IsNumber()
    readonly reviewCount?: number;

    @ApiPropertyOptional({ example: 123, description: 'Number of purchases' })
    @IsOptional()
    @IsNumber()
    readonly purchaseCount?: number;
}
