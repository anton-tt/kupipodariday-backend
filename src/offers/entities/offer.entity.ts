import { Entity, ManyToOne, Column, JoinTable } from 'typeorm';
import { IsNumber, IsUrl, IsBoolean, IsNotEmpty } from 'class-validator';
import { BaseEntity } from '../../utils/base.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  @IsNotEmpty()
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @JoinTable()
  @IsUrl()
  item: Wish;

  @Column('decimal', { scale: 2 })
  @IsNumber()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
