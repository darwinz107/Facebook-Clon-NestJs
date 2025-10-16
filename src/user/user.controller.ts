import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/validate-user.dto';
import type { Request, response, Response } from 'express';
import { AuthGuard } from './guards/auth/auth.guard';
import { Roles } from './decorators/auth/roles.decorator';
import { UserGuard } from './guards/user/user.guard';
import { roles } from './enums/rol.enum';
import { InteractionDTO } from './dto/interaction-user.dto';
import { DecodedToken } from './decorators/decodedToken.decorator';
import { UpdateInteractionDto } from './dto/interaction/update-interaction-user.dto';
import { CreatePostDto } from './dto/Post/create-post.dto';
import { UpdatePostDto } from './dto/Post/update-post.dto';
import { CreateStorieDto } from './dto/Post/create-storie.dto';
import { CreateLikesDto } from './dto/likes/create-likes.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("validate/login")
  validateLogin(@Body() loginDto:LoginDto) {
    return this.userService.validateUser(loginDto);
  }

  @Get('token/:id')
  createToken(@Param('id',ParseIntPipe) id: number, @Res({passthrough:true}) response:Response) {
    return this.userService.createToken(id,response);
  }
   @Roles('admin')
   @UseGuards(AuthGuard)
   @Get('rol')
   validateToken(){
     console.log(' Entró al método validateToken');
    return {acess:true,message:'Token is valid'};
   }
   @Roles('admin','user')
   @UseGuards(AuthGuard)
   @Get("get/token")
   existToken(){
     console.log(' Entró al método existToken');

    return {log:true}
   }

  @Get('logout')
  logout(@Res() response:Response){
   return this.userService.logout(response);
  }

  @UseGuards(UserGuard)
  @Get('insert/infoUpdate')
  setInfo(@Req() request:Request){
    console.log("request in controller:",request.user)
    return this.userService.showInfo(request.user);
  }
  
  @UseGuards(UserGuard)
  @Patch('update')
  update(/*@Param('id') id: string*/ @Req() request:Request, @Body() updateUserDto: UpdateUserDto) {

    return this.userService.update(request.user, updateUserDto);
  }

 @Post('deepseek')
  DeepSeekChat(@Body() prompt:{prompt:string}){
   return this.userService.DeepSeekIa(prompt);
  }

  @Post('gemini')
  geminiGenerateImg(@Body() prompt:{prompt:string}){
    return this.userService.geminiGenerateImg(prompt)
  }

  @Get('redtube')
  redtubeAPI(){
    return this.userService.redtubeAPI();
  }

  @Get('generate/imgStorie')
  generateImgStorie(){
    return this.userService.generateImgStorie();
  }

//  @Roles('admin')
//  @UseGuards(AuthGuard)
  @Get('infoUsers')
  userInfo(){
    return this.userService.usersInfo();
  }
 
  @UseGuards(UserGuard)
  @Get('facebook')
  getIdFacebook(@Req() request:Request){
   return this.userService.getIdFacebook(request.user);
  }

  @Post('interaction/:id/:id2')
  interactionBetweenUsers(@Param('id',ParseIntPipe) id:number, @Param('id2',ParseIntPipe) id2:number, @Body() InteractionDTO:InteractionDTO){
   console.log(InteractionDTO.message);
    return this.userService.interactionBetweenUsers({
      emisorId: id,
      receptorId: id2,
     message:InteractionDTO.message
    });
  }

  @Get('loadInteraction/:id/:id2')
  getInteractions(@Param('id',ParseIntPipe) id:number,@Param('id2') id2:number){
     return this.userService.getInteractions(id,+id2)
  }

  @Post("post/rol")
  createRol(@Body() rol:{rol:string}){
    return this.userService.insertRoles(rol.rol);
  }

  @Get("get/roles")
  async getRoles(){
    return await this.userService.getRoles();
  }

  @Get("messages/receptor/:id")
  async getReceptors(@Param('id',ParseIntPipe) id:number){
    //console.log("getReceptors");
     return this.userService.getReceptors(id);
  }

  @Get("total/notseen/:id")
  async getNotSeen(@Param('id',ParseIntPipe) id:number){
    return this.userService.getHanlderSeen(id);
  }

  @Get("notseenbyuser/:id/:id2")
  async getNotSeenByUser(@Param('id',ParseIntPipe) id:number, @Param('id2') id2:number){
       return this.userService.getSeenByUser(id,+id2);
  }

  @Patch("change/seen/:id/:id2")
  async setSeen(@Param('id',ParseIntPipe) id:number,@Param('id2',ParseIntPipe) id2:number, @Body() updateInteractionDto:UpdateInteractionDto){
     return this.userService.setLikeSeen(id,id2,updateInteractionDto);
  }

  @Post("create/post/:id")
  async createPost(@Param('id',ParseIntPipe) id:number,@Body() createPostDto:CreatePostDto){
     return this.userService.registerPost(id,createPostDto);
  }

  @Get("all/posts")
  async getAllPosts(){
    return this.userService.getAllPosts();
  }

  @Delete("posts/:id")
  async deletePost(@Param('id',ParseIntPipe) id:number){
     return this.userService.deletePost(id);
  }

  @Patch("post/content/:id")
  async updateContentPost(@Param('id',ParseIntPipe) id:number, @Body() updatePostDto:UpdatePostDto){
   
       return this.userService.updateContentPost(id,updatePostDto);
  }

  @Post("create/storie/:userId")
  async createStorie(@Param('userId',ParseIntPipe) id:number, @Body() createStorieDto:CreateStorieDto){
   return this.userService.createStorie(id,createStorieDto);
  }

  @Get("all/stories")
  async getAllStories(){
    return this.userService.getAllStories();
  }

  @Delete("delete/storie/:id")
async deleteStorie(@Param('id', ParseIntPipe) id:number){
  return this.userService.deleteStorie(id);
}

@Post("like/create")
async handleLike(@Body() createLikesDto: CreateLikesDto){
return this.userService.handleLikes(createLikesDto);
}

@Get("like/getbyid/:id")
async getLikeByPostId(@Param("id",ParseIntPipe) id:number){
 return this.userService.getLikesByPost(id);
}

@Get("like/getbyuser/:id/:postId")
async getLikeByUser(@Param("id",ParseIntPipe) id:number, @Param("postId", ParseIntPipe) postId:number){
 return this.userService.getLikeByUser(id,postId);
}

@Delete("like/delete/:id")
async deleteLikeById(@Param("id",ParseIntPipe) id:number){
 return this.userService.deleteLike(id);
}

}
