import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Login } from './entities/user.login.entity';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/validate-user.dto';
import  Jwt  from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class UserService {

  constructor(@InjectRepository(User)
  private userRepository: Repository<User>,
  @InjectRepository(Login)
  private loginRepository: Repository<Login>,
  private configService: ConfigService,
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

  async createToken(id: number) {

    const user = await this.loginRepository.createQueryBuilder('login')
    .innerJoin('login.user','user')
    .where('user.id = :id',{id:id})
    .select([
      'login.id',
      'login.email',
      'user.name',
      'user.cellphone',
      'user.gender',
      'user.rol'
    ])
    .getOne();
 
    if(!user){
   throw new NotFoundException("User don't found!");
    }
   
    const infoUser ={
      id : user.user.id,
      name: user.user.name,
      email: user.email,
      cellphone: user.user.cellphone,
      rol: user.user.rol
    }

    console.log(user)
    const secret = this.configService.get<string>('SECRET');
    if(!secret){
    throw new Error("There is not secret word")
    }
    const token = Jwt.sign(infoUser,secret,{expiresIn:'1h'});
    
    return {
      token:token
    };
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
