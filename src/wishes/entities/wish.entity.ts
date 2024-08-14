import { Entity, Column, OneToMany, ManyToOne, ManyToMany } from 'typeorm';
import {
  Length,
  IsString,
  IsUrl,
  IsNumber,
  IsInt,
  IsDecimal,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { BaseEntity } from '../../utils/base.entity';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsDecimal({ decimal_digits: '2' })
  price: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  @IsNumber()
  raised: number;

  @Column({ type: 'integer', default: 0 })
  @IsInt()
  copied: number;

  @Column()
  @IsString()
  @Length(1, 1024, {
    message:
      'Описание подарка должно быть не меньше 1 и не больше 1024 символов.',
  })
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  @IsNotEmpty()
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  @IsArray()
  offers: Array<Offer>;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  @IsArray()
  wishlists: Array<Wishlist>;
}
