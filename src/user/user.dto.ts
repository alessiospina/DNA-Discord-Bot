import { Expose } from "@nestjs/class-transformer";

export class UserDto {
    @Expose()
    readonly id: number;

    @Expose()
    readonly username: string;

    @Expose()
    readonly password: string;

    @Expose()
    readonly createdAt: Date;

    @Expose()
    readonly updatedAt: Date;
}
