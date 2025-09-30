import { PartialType } from "@nestjs/mapped-types";
import { Posts } from "src/user/entities/Posts/post.entity";

export class UpdatePostDto extends PartialType(Posts){

}