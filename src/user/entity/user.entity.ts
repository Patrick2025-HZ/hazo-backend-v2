import { Post } from 'src/posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
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

  @Column({ default: true, nullable: false })
  isActive: boolean;
  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;



  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

}
