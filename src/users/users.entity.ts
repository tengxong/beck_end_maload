import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    // constructor(){}

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column()
    email:string;
    
    @Column()
    password:string;

    @Column()
    dob:Date;

    @Column()
    profile:string;

    @Column({default:true})
    isActive:boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt:Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt:Date;
}