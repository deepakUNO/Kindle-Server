import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "../schemas/book.schema";
import mongoose from "mongoose";


export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    
    // @IsNotEmpty()
    // @IsMongoId()
    // readonly author: mongoose.Types.ObjectId;

    @IsOptional()
    @IsNotEmpty()
    readonly description?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    readonly price?: number;
    
    @IsNotEmpty()
    @IsEnum(Category)
    readonly category?: Category;
}
