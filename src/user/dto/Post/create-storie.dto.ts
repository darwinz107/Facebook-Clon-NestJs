import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateStorieDto{

    @IsString()
    @IsNotEmpty()
    content:string;
}