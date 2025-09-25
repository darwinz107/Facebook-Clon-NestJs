import { IsBoolean, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class InteractionDTO{
    
    @IsNumber()
    @IsNotEmpty()
    emisorId:number;
    
    @IsNumber()
    @IsNotEmpty()
    receptorId:number;
    
    @IsString()
    message:string

    @IsOptional()
    @IsBoolean()
    seen?:boolean;
}