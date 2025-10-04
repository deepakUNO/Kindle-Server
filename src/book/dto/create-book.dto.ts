import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "../schemas/book.schema";


export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsNotEmpty()
    readonly author: string;

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
