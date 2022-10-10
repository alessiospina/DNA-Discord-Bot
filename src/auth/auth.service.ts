/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { UserDto } from 'src/user/user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './login.request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
       private readonly userService: UserService,
       private readonly jwtService: JwtService
    ) {}

    async validateUser({username}): Promise<any> {
        let user = undefined
        try {
            user =  await this.userService.findByUsername(username);
        } catch (error) {
            throw new UnauthorizedException()
        }
        const { ...result } = user;
        return result;
    }

    async validateUserPass(username: string, pass: string): Promise<any> {
        let user: User = undefined
        try {
            user = await this.userService.findByUsername(username)
        } catch (error) {
            throw new UnauthorizedException()
        }
        if(!user)
            throw new UnauthorizedException()

        if(!bcrypt.compareSync(pass, user.password))
            throw new UnauthorizedException()
        
        return user
    }
    
    async login(user: LoginRequestDto) {
        let attempt: User = undefined
        try {
            attempt = await this.userService.findByUsername(user.username)
        } catch(error) {
            throw new UnauthorizedException()
        }

        if(!bcrypt.compareSync(user.password, attempt.password))
            throw new UnauthorizedException()

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
