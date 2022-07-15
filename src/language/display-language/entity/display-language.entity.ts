import ISO6391 from 'iso-639-1';
import {
  Entity,
  Column,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';
import { EnumDisplayLanguage } from '../display-language.constant';

// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
@Entity()
export class DisplayLanguage {
  @PrimaryColumn({
    type: 'enum',
    enum: EnumDisplayLanguage,
  })
  isoCode!: EnumDisplayLanguage;

  @Index()
  @Column({
    length: 20,
    unique: true,
  })
  isoName!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.isoName = ISO6391.getName(this.isoCode);
  }
}
