import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Stream } from 'src/stream/entities/stream.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  sentAt: Date;

  // Relationship with the Stream entity
  @ManyToOne(() => Stream, (stream) => stream.chats, { onDelete: 'CASCADE' })
  stream: Stream;

  // Relationship with the User entity
  @ManyToOne(() => User, (user) => user.chats, { nullable: true })
  user: User;
}