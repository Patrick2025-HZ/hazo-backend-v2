import { Comment } from 'src/comments/entity/comments.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Like } from './like.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  caption: string;

  @Column({ type: 'jsonb', nullable: true })
  file: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  abc: string[] | null;

  @Column({ type: 'boolean', default: false })
  is_reel: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, { onDelete: 'CASCADE' })
  comments: Comment;

  @OneToMany(() => Like, (like) => like.post, { onDelete: 'CASCADE' })
  like: Like[];
}
