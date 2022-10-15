/* eslint-disable prettier/prettier */
import { Expose } from "@nestjs/class-transformer"

export class CommandDto {
    @Expose()
    readonly id: number

    @Expose()
    readonly action: string

    @Expose()
    description: string

    @Expose()
    response: string

    @Expose()
    discordId: string

    @Expose()
    readonly createdAt: Date

    @Expose()
    readonly updatedAt: Date
}