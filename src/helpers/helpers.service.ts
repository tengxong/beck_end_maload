import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/users.entity';
const bcrypt =require ('bcrypt');
const jwt =require('jsonwebtoken');

@Injectable()
export class HelpersService {
  private jwtScretKey:string;
  private jwtRefreshScretKey:string;
  constructor(
    configService:ConfigService
  ){
    this.jwtScretKey = configService.get<string>('JWT_SECRET_KEY') ?? '';
    this.jwtRefreshScretKey = configService.get<string>('REFRESH_JWT_SECRET_KEY') ?? '';

  }
    async hashPasswordFunction(password: string): Promise<string> {
        const saltRounds = 10;
          
        // const salt = bcrypt.genSaltSync(saltRounds);
        // const hash = bcrypt.hashSync(password, salt);
    
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    }
    comparePassword(password: string, hashPassword: string): boolean {
        const match = bcrypt.compareSync(password, hashPassword); // true
        return match;
      }
    
      genToken(data: User): string {
        // console.log("first")
        // const secretKey = process.env.JWT_SECRET_KEY;
        // console.log({j:this.jwtScretKey})
        const token = jwt.sign(
          {
            data: data,
          },
        //   sign gen key
          // '@#sadfj#adsjkfa!aksdjf@9458@aksdf',
          // secretKey,
          this.jwtScretKey,
          { expiresIn: '1h' },
        );
     
        return token;
      
     }
    genRefreshToken(data: User): string {
      // console.log("first")
      // const secretKey = process.env.JWT_SECRET_KEY;
      // console.log({j:this.jwtScretKey})
      const token = jwt.sign(
        {
          data: data,
        },
      //   sign gen key
        // '@#sadfj#adsjkfa!aksdjf@9458@aksdf',
        // secretKey,
        this.jwtRefreshScretKey,
        { expiresIn: '30d' },
      );
   
      return token;
    
   }

     verifyAccessToken(token:string):User{
       try {
         const decoded =jwt.verify (token,this.jwtScretKey);
         return decoded;
      }catch (error:any) {
       throw new BadRequestException(error.message);
     }
    }
    verifyRefreshToken(token:string):User{
      try {
        const decoded =jwt.verify (token,this.jwtRefreshScretKey);
        return decoded;
     }catch (error:any) {
      throw new BadRequestException(error.message);
    }
   }
}
