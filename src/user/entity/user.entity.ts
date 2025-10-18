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
import { Like } from 'src/posts/entities/like.entity';

@Entity('user') // ✅ Explicit table name
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' }) // ✅ Explicit type
  email: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: true }) // ✅ Explicit type
  phoneNumber: string;

  @Column({ type: 'varchar' }) // ✅ Explicit type
  password: string;

  @Column({ type: 'varchar', nullable: true }) // ✅ Explicit type
  fullName: string;

  @Column({ type: 'varchar', nullable: true }) // ✅ Explicit type
  userName: string;

  @Column({ type: 'varchar', nullable: true }) // ✅ Explicit type
  dob: string;

  @Column({ type: 'varchar', nullable: true }) // ✅ Explicit type
  profilePicUrl: string;

  @Column({ type: 'boolean', default: false }) // ✅ Explicit type
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true }) // ✅ Changed from Date to timestamp
  deletedAt: Date;

  @Column({ type: 'boolean', default: true }) // ✅ Explicit type, removed nullable: false (redundant with default)
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' }) // ✅ Explicit type
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // ✅ Explicit type
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];

  @OneToMany(() => FollowerEntity, (el) => el.followedUser, {
    onDelete: 'CASCADE',
  })
  followers: FollowerEntity[];

  @OneToMany(() => FollowerEntity, (el) => el.follower, {
    onDelete: 'CASCADE',
  })
  following: FollowerEntity[];
}
