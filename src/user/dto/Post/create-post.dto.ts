import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto{
    
    @IsNumber()
    @IsNotEmpty()
    userId:number;

    @IsOptional()
    @IsString()
    description?:string;

    @IsOptional()
    @IsString()
    content?:string;
    
}