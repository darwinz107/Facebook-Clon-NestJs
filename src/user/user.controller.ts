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
}
