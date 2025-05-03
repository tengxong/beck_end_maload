import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { HelpersService } from "./helpers.service";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private helpersService:HelpersService){}
    canActivate(context: ExecutionContext): boolean  {
        const request = context.switchToHttp().getRequest();
        // const token = request.header.authorization.split('')[1]
        const token = request.headers.authorization.replace('Bearer ','');
        console.log({token})
        if(!token) throw new BadRequestException('Token must required!.');
        //  method1
        //bearer token
        //["bearer","token"]

        const userData = this.helpersService.verifyAccessToken(token);

        // console.log(userData)

        request.user = userData;
        return true
    }
}
// import {
//     BadRequestException,
//     CanActivate,
//     ExecutionContext,
//     Injectable,
//   } from '@nestjs/common';
//   import { HelpersService } from './helpers.service';
  
//   @Injectable()
//   export class AuthGuard implements CanActivate {
//     constructor(private readonly helpersService: HelpersService) {}
  
//     canActivate(context: ExecutionContext): boolean {
//       const request = context.switchToHttp().getRequest();
//       // const token = request.headers.authorization.split(' ')[1]
//       const token: string = request.headers.authorization.replace('Bearer ', '');
//       if (!token) throw new BadRequestException('Token must required!.');
  
//       // Method1
//       // Bearer asdljkflm;erfiupadkos;l';fmasfsalf
//       // request.headers.authorization.split(' ') =>
//       // ["Bearer", "asdljkflm;erfiupadkos;l';fmasfsalf"]
  
//       // Method 2
//       // Bearer asdljkflm;erfiupadkos;l';fmasfsalf
//       // request.headers.authorization.replace('Bearer ', '') => asdljkflm;erfiupadkos;l';fmasfsalf
   
//       const userData = this.helpersService.verifyAccessToken(token);
  
//       request.user = userData;
//       return true;
//    }
//   }