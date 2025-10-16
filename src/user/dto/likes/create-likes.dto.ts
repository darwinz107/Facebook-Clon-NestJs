import { IsNotEmpty, IsNumber } from "class-validator";


export class CreateLikesDto
{
@IsNumber()
@IsNotEmpty()    
userId:number;
@IsNumber()
@IsNotEmpty()
PostId:number;
}