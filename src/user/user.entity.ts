/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'USERS', synchronize: true})
export class User {
    
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name: 'username', unique: true, length: 64, nullable: false })
    username: string;

    @Column({name: 'password', nullable: false, length: 256 })
    password: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name:'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt: Date;

    constructor(id: number, username: string, password: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.createdAt = createdAt
        this.updatedAt = updatedAt;
    }
}
