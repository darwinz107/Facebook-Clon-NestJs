import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class InteractionDTO{
    
    @IsNumber()
    @IsNotEmpty()
    emisorId:number;
    
    @IsNumber()
    @IsNotEmpty()
    receptorId:number;
    
    @IsString()
    message:string
}