import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { otp } from './otp.entity';

@Entity()
export class pending_user {
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false, nullable: false })
  isActive: boolean;

  // relation
  @OneToOne(() => otp, (Otp) => Otp.pendingUserId, { cascade: true })
  Otp: otp;
}
