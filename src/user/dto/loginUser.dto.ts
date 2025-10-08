import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class loginUserDto {
    @ApiProperty({ example: 'john@example.com' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ minLength: 6 })
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}  