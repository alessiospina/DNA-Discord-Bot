/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'COMMAND', synchronize: true})
export class Command {
    
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name: 'action', unique: true, length: 128, nullable: false })
    action: string;

    @Column({name: 'response', nullable: false, type: "text" })
    response: string;

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

    constructor(id: number, action: string, response: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.action = action;
        this.response = response;
        this.createdAt = createdAt
        this.updatedAt = updatedAt;
    }
}
