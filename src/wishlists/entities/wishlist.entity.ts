import { Entity, Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm';
import { Length, IsString, IsUrl, IsArray, IsNotEmpty } from 'class-validator';
import { BaseEntity } from '../../utils/base.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  @IsNotEmpty()
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  @IsArray()
  items: Array<Wish>;
}
