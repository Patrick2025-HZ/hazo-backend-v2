import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class blockListTokenEntity {
     @PrimaryGeneratedColumn('uuid')
      id: number;

      @Column()
      token:string;

      @Column({ type: 'timestamp' })  
      expires_at: Date;
}
