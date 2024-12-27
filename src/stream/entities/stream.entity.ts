import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('streams')
export class Stream {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', unique: true })
  url: string;

  @Column({ type: 'int', default: 0 })
  duration: number; // Duration in seconds

  @Column({ 
    type: 'varchar',
    length: 20,
    default: 'active',
  })
  status: 'active' | 'completed';

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  endedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
