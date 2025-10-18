import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../entity/user.entity';

@Entity()
export class FollowerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.following, {
    onDelete: 'CASCADE',
  })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers, {
    onDelete: 'CASCADE',
  })
  followedUser: User;

  @CreateDateColumn()
  createdAt: Date;
}
