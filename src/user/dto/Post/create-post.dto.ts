import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto{

    @IsOptional()
    @IsString()
    description?:string;

    @IsOptional()
    @IsString()
    content?:string;
    
}