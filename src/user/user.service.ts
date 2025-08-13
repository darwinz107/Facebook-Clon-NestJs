import { Body, Injectable, NotFoundException, ParseDatePipe, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Login } from './entities/user.login.entity';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/validate-user.dto';
import  Jwt  from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import cookie from 'cookie'
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InferenceClient } from "@huggingface/inference";
import { GoogleGenAI, Modality } from "@google/genai";



@Injectable()
export class UserService {

  constructor(@InjectRepository(User)
  private userRepository: Repository<User>,
  @InjectRepository(Login)
  private loginRepository: Repository<Login>,
  private configService: ConfigService,
  private readonly jwtService:JwtService,
  private dataSource:DataSource
){}

  
 async create(createUserDto: CreateUserDto): Promise<String> {
  try {
    
  
    const{name,cellphone,gender,email,password} = createUserDto;

    const validateCellphone = await this.userRepository.findOne({
      where:{
        cellphone:cellphone
      },
      select:['cellphone']
    });

  if(validateCellphone?.cellphone == cellphone){
     
    
    return "Number already has been registered!";
  }

  const validateEmail = await this.loginRepository.findOne({
    where:{
      email:email
    },
    select:['email']
  })

  if(validateEmail?.email == email){
   
   return "Email already has been registered";
  }
  
    const user =  this.userRepository.create({name,cellphone,gender});
    await this.userRepository.save(user);

    const findUser = await this.userRepository.findOne({
      where:{
        cellphone:cellphone
      }
    });
   
    if(!findUser){
     throw new NotFoundException("Not found");
    }
    
    const passHasehd = await bcrypt.hash(password,10);

    const login =  this.loginRepository.create({email,password:passHasehd,user:findUser})

    await this.loginRepository.save(login);

    return `User ${name} was created!`;
    } catch (error) {
   return `Error: ${error}` 
  }
  }

  async validateUser(loginDto:LoginDto):Promise<Object> {

  const user = await this.loginRepository.findOne({
    where:{
      email:loginDto.email
    }
    ,relations:['user']
  });  

/*  const user = await this.userRepository.createQueryBuilder('login')
  .innerJoin('login.user','user')
  .where('user.id = :id',{id:id?.user.id})
  .select([
    'login.email',
    'login.password',
    'user.id'
  ])
  .getOne();*/

  /*  const user = await this.loginRepository.findOne({
      where:{
        email:loginDto.email
      }
      ,select:['email','password']
    })*/
 
    if(!user){
   return {message:"Account don't found!",
    acces: false
   }
    }

  const validatePass = await bcrypt.compare(loginDto.password,user.password)

    if(!validatePass){
      return {message: "Incorrect password",acces:false};
    }

    return {message:`Welcome user ${user.email}  - id: ${user.user.id}`,acces:true,id:user.user.id};
  }

  async createToken(id: number, response:Response) {

    const user = await this.loginRepository.createQueryBuilder('login')
    .innerJoin('login.user','user')
    .innerJoin('user.rol','rol')
    .where('user.id = :id',{id:id})
    .select([
      'user.id',
      'login.email',
      'user.name',
      'user.cellphone',
      'user.gender',
      'rol.rol'
    ])
    .getOne();
 console.log(user);
    if(!user){
   throw new NotFoundException("User don't found!");
    }
   
    const infoUser ={
      id : user.user.id,
      name: user.user.name,
      email: user.email,
      cellphone: user.user.cellphone,
      rol: user.user.rol.rol,
    }

    console.log(user)
    const secret = this.configService.get<string>('SECRET');
    if(!secret){
    throw new Error("There is not secret word")
    }
    const token = this.jwtService.sign(infoUser);

    response.cookie("token",token,{
      httpOnly:true,
      maxAge:3600*1000
    });
   return {
      token:"Cookie created!"
    };
  }

   logout(response:Response){
     
    response.clearCookie("token",{
      httpOnly:true
    });
    response.send({message:"Cookie eliminated",session:"Session closed"})
   }

  async showInfo(request:{id:number}){

  console.log(request.id);
    const id = request.id;

    const user = await this.loginRepository.createQueryBuilder('login')
    .innerJoin('login.user','user')
    .where('user.id = :id',{id:id})
    .select([
      'user.name',
      'user.cellphone',
      'user.gender',
      'login.email'
    ])
    .getOne();
    
    const info = {
      name:user?.user.name,
      cellphone: user?.user.cellphone,
      gender:user?.user.gender,
      email:user?.email
    };

    return info;

   }

  async update(/*id: number*/ payloado:{id:number}, updateUserDto: UpdateUserDto) {
    
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    
 
    
    
try{

const findUser = await queryRunner.manager.createQueryBuilder(Login,'login')
    .innerJoin('login.user','user')
    .where('user.id = :id',{id:payloado.id})
    .select([
      'login.id'
    ])
    .getOne();

    if(!findUser){
      throw new NotFoundException(`User with ${payloado.id} not found`);
    }

const infoUser = {
  name: updateUserDto.name,
  cellphone: updateUserDto.cellphone,
  gender: updateUserDto.gender
};
const infoLogin ={
  email:updateUserDto.email
}

 await queryRunner.manager.update(User,payloado.id,infoUser);
 await queryRunner.manager.update(Login,findUser.id,infoLogin);

 queryRunner.commitTransaction();
    return {message:`This action updates a #${payloado.id} user`,id:payloado.id};
}catch(error){
throw new Error(`Error in update: ${error.message}`);
queryRunner.rollbackTransaction();
}finally{
queryRunner.release();
}
    
  }

 async DeepSeekIa(prompt:{prompt:string}){
    const client = new InferenceClient(process.env.HF_TOKEN);

const chatCompletion = await client.chatCompletion({
    provider: "fireworks-ai",
    model: "deepseek-ai/DeepSeek-R1",
    messages: [
        {
            role: "user",
            content: prompt.prompt,
        },
    ],
});


console.log(chatCompletion.choices[0].message);
return {message:chatCompletion.choices[0].message.content};
  }

  async geminiGenerateImg(prompt:{prompt:string}){
 
    console.log(prompt.prompt);

    const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
    
  try{
const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: prompt.prompt,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });
 
  if(response?.candidates
   && response.candidates[0]?.content?.parts 
  ){
   for (const part of response.candidates[0].content.parts) {
    // Based on the part type, either show the text or save the image
    let generateJson = {text:'',
        binary:''}
     if(part.text){
        console.log(part.text)
      generateJson.text = part.text;
      
     }

     if ( part.inlineData) {
      const imageData = part.inlineData?.data;
      if(imageData){
      /*const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
       */
      generateJson.binary = imageData;
   
      return generateJson;
      
      }else{
       console.log("Error at generate image")
      }
    }
  }
}else{
console.log("Error: Response empty")
}

  }catch(error){
    throw new Error("Error in gemini: ", error.message)
  }
  
}

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
