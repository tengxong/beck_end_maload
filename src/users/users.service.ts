import {  BadRequestException, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from 'src/helpers/helpers.service';

@Injectable()
export class UsersService {
    findOneBy(username: string) {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>,
        private readonly helpersService: HelpersService,
    ){}
    hello(): boolean {
        return false;
    }

    async create(user: User): Promise<User> {
        const hashPassword =await this.helpersService.hashPasswordFunction(
            user.password
        );
        console.log({hashPassword})

        if (!user.firstName || !user.email || !user.password)
        throw new BadRequestException('Parameter is empty!.');

        const emailExist = await this.userRepository.findOneBy({
            email:user.email,
        });

        // console.log({emailExist});

        if(emailExist) throw new BadRequestException('Email is already exist!.');

        const createUserData = await this.userRepository.save({...user,password:hashPassword});

        return createUserData;
    }
    update({ id }: { id: string }): string {
        return id;
    }
    findOne({ id }: { id: string }): string {
        return id;
    }
    async login({
        email,
        password,
      }: {
        email: string;
        password: string;
      }): Promise<{ token: string , refreshToken: string }> {
        // Validate data
        if (!email || !password)
          throw new BadRequestException('Email or password must required!.');
    
        // Check email alreay in database
        const existEmail = await this.userRepository.findOneBy({ email });
        if (!existEmail)
            throw new BadRequestException('Email or password incorrect!.');
        // Compare password in database and input passord
        const pwMatch = this.helpersService.comparePassword(
          password,
          existEmail?.password,
        );
        if (!pwMatch)
          throw new BadRequestException('Email or password incorrect!.');
    
        // Gen token
        const data = {
         id: existEmail?.id,
         firstName: existEmail?.firstName,
         lastName: existEmail?.lastName,
        } as User;
      // console.log("00000")
        const token = this.helpersService.genToken(data);
        const refreshToken = this.helpersService.genRefreshToken(data);
        return{token,refreshToken};
    }
    async updateUserProfile(user: User, request: any): Promise<User> {
      // Validate data input
      if (!user.firstName || !user.lastName)
        throw new BadRequestException('Parameter is empty!.');
  
      // Clear email from user input
      if (user.email) user.email ;
  
      // Hash password if user input
      if (user.password) {
        const hashPW: string = await this.helpersService.hashPasswordFunction(
          user.password,
        );
        user.password = hashPW;
      }
  
      // Check user already in database
      const userDataFromToken = request.user;
  
      const id: number = userDataFromToken.data.id;
      const existUser = await this.userRepository.findOne({ where: { id } });
      if (!existUser) throw new BadRequestException('User not found');

  
      await this.userRepository.update(id, user);
      const userData = await this.userRepository.findOneById(id);
      if (!userData) {
        throw new BadRequestException('User not found');
      }
      return userData;
   }
   async deleteUser({ id }: { id: number }): Promise<User> {
    const existUser = await this.userRepository.findOneById(id);
    if (!existUser) {
        throw new BadRequestException('User not found');
    }
    if (!existUser) throw new BadRequestException('delete your data already!.');
    await this.userRepository.delete(id);
    return existUser;
   }
   // get all users
   async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // get owner profile from user table
  async getOwnerProfile(requast): Promise<User> {
    console.log(requast);
    //requast ={
  //   user:{
  //     data:{id:1,firstname:"admin",lastname:"admin"}
  //   }
  // };
  // find user data from user table by id
  const userData = await this.userRepository.findOneBy({ id: requast.user.data.id });

  // clear password field
  if (!userData) throw new BadRequestException('User not found!');
   delete (userData as any).password; 
    return userData;
  }

  // refresh token from user table
  async refreshToken(request: any): Promise<{token: string, refreshToken: string}> {
    
    // Validate refresh token request
    console.log({request:request.headers['refresh-token']});

    const userDataFromRefreshToken:any  = 
    this.helpersService.verifyRefreshToken(request.headers['refresh-token']);
    
      const data = userDataFromRefreshToken.data;
      const newToken = this.helpersService.genToken(data);
      const newRefreshToken = this.helpersService.genRefreshToken(data);
      return {token:newToken,refreshToken:newRefreshToken};
  }
}
