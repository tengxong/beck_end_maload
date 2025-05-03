import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthGuard } from 'src/helpers/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get('preview1')
    hello(): boolean {
        return this.userService.hello();
    }
    @Post('create')
    create(@Body() user: User): Promise<User> {
        return this.userService.create(user);
    }
    @Post('login')
    login(
        @Body() { email, password }: { email: string; password: string },
    ): Promise<{ token: string }> {
        return this.userService.login({ email, password });
    }
    @Put('update/profile')
    @UseGuards(AuthGuard)
    updateProfile(@Req() request, @Body() user: User,):Promise<User>{
        return this.userService.updateUserProfile(user,request);
    }
    @Delete('delete/:id')
    @UseGuards(AuthGuard)
    async deletePost(@Param('id') id: number): Promise<User> {
      return this.userService.deleteUser({ id: Number(id) });
    }
    @Get("all")
    @UseGuards(AuthGuard)
    async getAllUsers(): Promise<User[]> {
      return await this.userService.findAll();
    }
    @Get('profile')
    @UseGuards(AuthGuard)
    ownerProfile(@Req() request): Promise<User> {
    return this.userService.getOwnerProfile(request);
    }
    @Put('refresh/token')
     refreshToken(@Req() request:any): Promise<{ token: string; refreshToken: string }> {
         return this.userService.refreshToken(request);
     }
}
