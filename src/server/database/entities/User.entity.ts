import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Post } from "./Post.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  email!: string

  @Column({ select: false })
  password!: string

  @Column()
  username!: string;

  @Column()
  name!: string;

  @Column({ default: true })
  isActive?: boolean

  @OneToMany(() => Post, (post) => post.creator)
  posts!: Post[];
}