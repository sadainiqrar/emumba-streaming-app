import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Chat } from 'src/chat/entities/chat.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  googleId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: null })
  accessToken: string;

  @Column({ default: 'user' })
  role: string; // 'user' or 'admin'

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];
}
