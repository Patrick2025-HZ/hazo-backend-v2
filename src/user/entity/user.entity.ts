import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class user {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fullName: string;


  @Column({ nullable: true })
  userName:string;

  @Column({ nullable: true })
  phoneNumber:string;

  @Column({ nullable: true })
  dob:string

  @Column({ nullable: true })
  profilePicUrl: string; 

  @Column({default:false})
  isDeleted:boolean

  @Column({ nullable: true })
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;



}
