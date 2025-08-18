import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/validate-user.dto';
import type { Request, response, Response } from 'express';
import { AuthGuard } from './guards/auth/auth.guard';
import { Roles } from './decorators/auth/roles.decorator';
import { UserGuard } from './guards/user/user.guard';

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
