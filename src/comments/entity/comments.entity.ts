import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  parentComment: Comment | null;

  @Column({ default: false })
  isLiked: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
