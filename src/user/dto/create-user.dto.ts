import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    name:string;
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    cellphone:string;
    @IsString()
    gender:string;
    @IsEmail()
    email:string;
    @MinLength(8)
    password:string;

}

export class createLoginDto{

}
