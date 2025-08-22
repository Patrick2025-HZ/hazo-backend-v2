import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../entity/user.entity';

@Entity()
export class FollowerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @ManyToOne(() => User, (user) => user.following)
  follower: User;


  @ManyToOne(() => User, (user) => user.followers)
  followedUser: User;

  @CreateDateColumn()
  createdAt: Date;
}

