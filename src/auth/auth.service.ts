/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { UserDto } from 'src/user/user.dto';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './login.request.dto';

@Injectable()
export class AuthService {
    constructor(
       private readonly userService: UserService,
       private readonly jwtService: JwtService
    ) {}

    async validateUser({username}): Promise<any> {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED)
        }
        const { ...result } = user;
        return result;
    }

    async validateUserPass(username: string, pass: string): Promise<any> {
        const user = await this.userService.findByUsername(username)
        if (user && user.password === pass) {
          const { password, ...result } = user;
          return result;
        }
        return null;
    }
    
    async login(user: LoginRequestDto) {
        let attempt = undefined
        try {
            attempt = await this.userService.findByUsername(user.username)
        } catch(error) {
            throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED)
        }
        return this._createToken(attempt)
    }

    private _createToken({ username }: UserDto): any {
        const expiresIn = process.env.JWT_EXPIRE_IN;
        const user: {username: string} = { username };
        const accessToken = this.jwtService.sign(user);
        return {
            expires_in: expiresIn,
            access_token: accessToken,
        };
    }
}
