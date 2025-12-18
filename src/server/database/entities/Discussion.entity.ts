import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './User.entity';
import { Post } from './Post.entity';

@Entity('discussions')
export class Discussion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: true })
  content?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  creator?: User | null;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  post!: Post;

  @ManyToOne(() => Discussion, (d) => d.children, { nullable: true, onDelete: 'CASCADE' })
  parent?: Discussion | null;

  @OneToMany(() => Discussion, (d) => d.parent)
  children!: Discussion[];
}
