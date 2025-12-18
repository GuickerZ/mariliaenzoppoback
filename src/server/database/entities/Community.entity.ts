import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './User.entity';
import { Post } from './Post.entity';

@Entity('communities')
export class Community {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  creator?: User;

  @ManyToMany(() => User)
  @JoinTable({ name: 'community_members' })
  members!: User[];

  @OneToMany(() => Post, (post) => post.community)
  posts!: Post[];
}
