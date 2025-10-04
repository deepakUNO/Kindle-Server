import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";  


export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly userName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(6)
     password: string;

    @IsOptional()
    @IsNumber()
    readonly age?: number;

    @IsOptional()
    readonly address?: string;

    @IsOptional()
    readonly authorOfBooks?: string[];
   
}  