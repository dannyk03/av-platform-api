import {
  Entity,
  Column,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
@Entity()
export class DisplayLanguage {
  @PrimaryColumn({
    type: 'varchar',
    length: 2,
  })
  isoCode!: string;

  @Index()
  @Column({
    type: 'varchar',
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
}
