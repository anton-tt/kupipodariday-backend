import { Entity, Column, OneToMany, JoinTable } from 'typeorm';
import { Length, IsString, IsUrl, IsEmail, IsArray } from 'class-validator';
import { BaseEntity } from '../../utils/base.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  @Length(3, 20)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Length(5, 25)
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  @IsArray()
  wishes: Array<Wish>;

  @OneToMany(() => Offer, (offer) => offer.user)
  @JoinTable()
  @IsArray()
  offers: Array<Offer>;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  @JoinTable()
  @IsArray()
  wishlists: Array<Wishlist>;
}
