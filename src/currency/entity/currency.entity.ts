import { CurrencyCodeType } from '@avo/type';
import cc from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';
import currencyToSymbolMap from 'currency-symbol-map/map';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'currencies' })
export class Currency {
  @PrimaryColumn({
    length: 4,
  })
  code!: CurrencyCodeType;

  @Column({
    length: 30,
    unique: true,
  })
  name!: string;

  @Column({
    type: 'enum',
    enum: [...new Set(Object.values(currencyToSymbolMap))],
  })
  symbol!: string;

  @Column({
    type: 'enum',
    unique: true,
    enum: cc.numbers(),
  })
  number!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    const ccObj = cc.code(this.code);
    this.name = ccObj.currency;
    this.number = ccObj.number;
    this.symbol = getSymbolFromCurrency(this.code);
  }
}
