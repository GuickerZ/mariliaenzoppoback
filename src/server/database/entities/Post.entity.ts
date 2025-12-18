import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User.entity';
import { Community } from './Community.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: 0 })
  qualidade!: number;

  @Column({ default: 0 })
  naoGostou!: number;

  @ManyToMany(() => User)
  @JoinTable({ name: 'post_likes' })
  likedBy!: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'post_dislikes' })
  dislikedBy!: User[];

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  creator!: User;

  @ManyToOne(() => Community, (community) => community.posts, { nullable: true, onDelete: 'SET NULL' })
  community?: Community;
}
