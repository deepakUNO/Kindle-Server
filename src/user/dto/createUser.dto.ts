import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'johndoe' })
    @IsNotEmpty()
    @IsString()
    readonly userName: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ minLength: 6 })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ example: 30 })
    @IsOptional()
    @IsNumber()
    readonly age?: number;

    @ApiPropertyOptional({ example: '123 Main St' })
    @IsOptional()
    readonly address?: string;

    @ApiPropertyOptional({ example: ['bookId1', 'bookId2'] })
    @IsOptional()
    readonly authorOfBooks?: string[];

}