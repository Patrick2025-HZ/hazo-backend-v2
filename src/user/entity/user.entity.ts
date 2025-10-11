import { Post } from '../../posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { FollowerEntity } from '../follower/entity/follower.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  userName: string;

  @Column({ nullable: true })
  dob: string;

  @Column({ nullable: true })
  profilePicUrl: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ default: true, nullable: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => FollowerEntity, (el) => el.followedUser)
  followers: FollowerEntity[];

  @OneToMany(() => FollowerEntity, (el) => el.follower)
  following: FollowerEntity[];
}
