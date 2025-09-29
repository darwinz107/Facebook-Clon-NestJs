import { Body, Injectable, NotFoundException, ParseDatePipe, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, In, Repository } from 'typeorm';
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
import { InteractionDTO } from './dto/interaction-user.dto';
import { Interaction } from './entities/user.interaction.entity';
import { Rol } from './entities/user.rol.entity';
import { UpdateInteractionDto } from './dto/interaction/update-interaction-user.dto';
import { CreatePostDto } from './dto/Post/create-post.dto';
import { Posts } from './entities/Posts/post.entity';



@Injectable()
export class UserService {

  constructor(@InjectRepository(User)
  private userRepository: Repository<User>,
  @InjectRepository(Login)
  private loginRepository: Repository<Login>,
  @InjectRepository(Interaction)
  private interactionRepository: Repository<Interaction>,
  @InjectRepository(Rol)
  private rolRepository: Repository<Rol>,
  @InjectRepository(Posts)
  private postsRepository: Repository<Posts>,

  //configService lo inyecto para llamar a la palabra SECRET
  private configService: ConfigService,
  private readonly jwtService:JwtService,
  private dataSource:DataSource
){}

  
 async create(createUserDto: CreateUserDto): Promise<String> {
  try {
    const{name,cellphone,gender,email,password} = createUserDto;
     const cantUser = await this.userRepository.find();
     if(cantUser.length ==0){
      const user =  this.userRepository.create({name,cellphone,gender,rol:{id:2}});
    await this.userRepository.save(user);
    return "";
     }

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
  
    const user =  this.userRepository.create({name,cellphone,gender,rol:{id:2}});
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
      rol: user.user.rol,
    }

    console.log(user)
    const secret = this.configService.get<string>('SECRET');
    if(!secret){
    throw new Error("There is not secret word")
    }
    const token = this.jwtService.sign(infoUser);

    response.cookie("token",token,{
      httpOnly:true,
      secure:true,
      sameSite:'none',
      maxAge:3600*1000
    });
   return {
      token:"Cookie created!"
    };
  }

   logout(response:Response){
     
    response.clearCookie("token",{
      httpOnly:true,
      secure:true,
      sameSite:'none'
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

async redtubeAPI (){

const category = ["tits","ass"];
  const params = new URLSearchParams({
    search:"BigTits"
  })

if(category){  
category.forEach((element)=>{
  params.append('tags[]',element);
})  
}else{
  params.append('tags[]','');
}
  
  const link = `https://api.redtube.com/?data=redtube.Videos.searchVideos&output=json&${params.toString()}&thumbsize=medium`;
  
  const response = await fetch(link,{
    method:'GET'
  });

  const data = await response.json();
  return data;

}

async generateImgStorie(){

  try {
     const respose = await fetch("https://gist.githubusercontent.com/poudyalanil/ca84582cbeb4fc123a13290a586da925/raw/videos.json",{
    method:'GET',
    
  });

  const data = await respose.json();
  return data;
    
  } catch (error) {
    console.error("Error fetching image stories:", error);
  }
 
}

  async usersInfo(){

    const users = await this.userRepository.find();

    return users;
  }

  async interactionBetweenUsers(interactionDTO:InteractionDTO){
    
     return await this.dataSource.query("Call P_interactionBetweenUsers(?,?,?)",[interactionDTO.emisorId,interactionDTO.receptorId,interactionDTO.message]);
     
  }

  async getInteractions(id:number,id2:number) {
      return await this.interactionRepository.find({
        where:{
          emisorId:{
            id: In([id,id2])
          },
          receptorId:{
            id: In([id,id2])
          }
        },
        order:{
          date:"ASC"
        },
        relations:['emisorId']
        ,
        select:{
          emisorId:{id:true},
          message:true,
          date:true
        }
      }
    )
  }
  async getIdFacebook(request:Request){
  return {request};
  }

  async insertRoles(rol:string){
    
    const sameRol = await this.rolRepository.findOne({where:{
      rol:rol
    }});
    console.log(sameRol);
    if(sameRol) return "Rol already created!";
    const createRol= this.rolRepository.create({rol});
    return await this.rolRepository.save(createRol);
  }

  async getRoles(){
    return await this.rolRepository.find();
  }

  async getReceptors(id:number){
     const msjReceptors = await this.interactionRepository.find({where:{
      receptorId:{
        id:id
      }
     },select:['receptorId','message'],relations:['receptorId']});

     return msjReceptors;
  }

  async getHanlderSeen(id:number){
    const msjNotSeen = await this.interactionRepository.find({
      where:{
        receptorId:{id:id},
        seen:false
      }
    });

    return msjNotSeen;
  }

  async getSeenByUser(id:number,id2:number){
    const msjNotSeen = await this.interactionRepository.find({
      where:{
          emisorId:{
            id:id2
          },
          receptorId:{
            id:id
          },
          seen:false
      }
    });

    return msjNotSeen;
  }

  async setLikeSeen(id:number,id2:number,updateInteractionDto:UpdateInteractionDto){
     const msjLikeSeen = await this.interactionRepository.update({emisorId:{id:id2},receptorId:{id:id},seen:false},{seen:updateInteractionDto.seen});
      return msjLikeSeen;
  }


  async registerPost(id:number,createPostDto:CreatePostDto){
   
   const findUser = await this.userRepository.findOne({where:{
    id:id
   }});

   if(!findUser){
     throw new NotFoundException("Don't found user");
   }

     const createPost= await this.postsRepository.create({user:findUser,description:createPostDto.description,content:createPostDto.content}); 
     return this.postsRepository.save(createPost);
  }

  async getAllPosts(){
    const findPosts = await this.postsRepository.find({relations:['user'],order:{datePublish:'DESC'}});
    return findPosts;
  }

  async deletePost(id:number){
    const findPost = await this.postsRepository.findOne({
      where:{
        id:id
      }
    });

    if(!findPost){
    throw new NotFoundException("Don't have a post!");
    };

   await this.postsRepository.delete(id);

   return {msj:"Post was deleted succesful!"};
  }

}




