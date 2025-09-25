import { PartialType } from "@nestjs/mapped-types";
import { InteractionDTO } from "../interaction-user.dto";

export class UpdateInteractionDto extends PartialType(InteractionDTO){
    
}