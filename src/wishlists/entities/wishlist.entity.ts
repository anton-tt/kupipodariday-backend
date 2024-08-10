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
  @IsString()
  @Length(1, 1500, {
    message:
      'Описание подарка должно быть не меньше 1 и не больше 1500 символов.',
  })
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  @IsArray()
  items: Array<Wish>;

  @ManyToOne(() => User, (user) => user.wishlists)
  @IsNotEmpty()
  owner: User;
}
