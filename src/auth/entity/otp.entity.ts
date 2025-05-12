import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { pending_user } from './pending_user.entity';

@Entity()
export class otp {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  otpCode: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  expired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => pending_user, (user) => user.Otp, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pendingUserId' })
  pendingUserId: pending_user;
}
