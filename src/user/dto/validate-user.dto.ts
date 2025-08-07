import { IsEmail, IsNumber, MinLength } from "class-validator";


export class LoginDto{
    @IsEmail()
    email: string;
    @IsNumber()
    @MinLength(8)
    password:string;
}