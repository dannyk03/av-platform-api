import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658247664004 implements MigrationInterface {
  name = 'migration1658247664004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_displa"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_images"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_displ"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_image"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."currencies_symbol_enum" AS ENUM(
                'د.إ',
                '؋',
                'L',
                '֏',
                'ƒ',
                'Kz',
                '$',
                '₼',
                'KM',
                '৳',
                'лв',
                '.د.ب',
                'FBu',
                '$b',
                'BOV',
                'R$',
                '₿',
                'Nu.',
                'P',
                'Br',
                'BZ$',
                'FC',
                'CHE',
                'CHF',
                'CHW',
                'CLF',
                '¥',
                'COU',
                '₡',
                '₱',
                'Kč',
                'Fdj',
                'kr',
                'RD$',
                'دج',
                '£',
                'Nfk',
                'Ξ',
                '€',
                '₾',
                '₵',
                'GH₵',
                'D',
                'FG',
                'Q',
                'kn',
                'G',
                'Ft',
                'Rp',
                '₪',
                '₹',
                'ع.د',
                '﷼',
                'J$',
                'JD',
                'KSh',
                '៛',
                'CF',
                '₩',
                'KD',
                '₸',
                '₭',
                '₨',
                'M',
                'Ł',
                'Lt',
                'Ls',
                'LD',
                'MAD',
                'lei',
                'Ar',
                'ден',
                'K',
                '₮',
                'MOP$',
                'UM',
                'Rf',
                'MK',
                'MXV',
                'RM',
                'MT',
                '₦',
                'C$',
                'B/.',
                'S/.',
                'zł',
                'Gs',
                '￥',
                'Дин.',
                '₽',
                'R₣',
                'ج.س.',
                'S$',
                'Le',
                'S',
                'Db',
                'E',
                '฿',
                'SM',
                'T',
                'د.ت',
                'T$',
                '₤',
                '₺',
                'TT$',
                'NT$',
                'TSh',
                '₴',
                'USh',
                'UYI',
                '$U',
                'UYW',
                'Bs',
                'Bs.S',
                '₫',
                'VT',
                'WS$',
                'FCFA',
                'Ƀ',
                'CFA',
                '₣',
                'Sucre',
                'XUA',
                'R',
                'ZK',
                'Z$'
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."currencies_number_enum" AS ENUM(
                '784',
                '971',
                '008',
                '051',
                '532',
                '973',
                '032',
                '036',
                '533',
                '944',
                '977',
                '052',
                '050',
                '975',
                '048',
                '108',
                '060',
                '096',
                '068',
                '984',
                '986',
                '044',
                '064',
                '072',
                '933',
                '084',
                '124',
                '976',
                '947',
                '756',
                '948',
                '990',
                '152',
                '156',
                '170',
                '970',
                '188',
                '931',
                '192',
                '132',
                '203',
                '262',
                '208',
                '214',
                '012',
                '818',
                '232',
                '230',
                '978',
                '242',
                '238',
                '826',
                '981',
                '936',
                '292',
                '270',
                '324',
                '320',
                '328',
                '344',
                '340',
                '191',
                '332',
                '348',
                '360',
                '376',
                '356',
                '368',
                '364',
                '352',
                '388',
                '400',
                '392',
                '404',
                '417',
                '116',
                '174',
                '408',
                '410',
                '414',
                '136',
                '398',
                '418',
                '422',
                '144',
                '430',
                '426',
                '434',
                '504',
                '498',
                '969',
                '807',
                '104',
                '496',
                '446',
                '929',
                '480',
                '462',
                '454',
                '484',
                '979',
                '458',
                '943',
                '516',
                '566',
                '558',
                '578',
                '524',
                '554',
                '512',
                '590',
                '604',
                '598',
                '608',
                '586',
                '985',
                '600',
                '634',
                '946',
                '941',
                '643',
                '646',
                '682',
                '090',
                '690',
                '938',
                '752',
                '702',
                '654',
                '694',
                '706',
                '968',
                '728',
                '930',
                '222',
                '760',
                '748',
                '764',
                '972',
                '934',
                '788',
                '776',
                '949',
                '780',
                '901',
                '834',
                '980',
                '800',
                '840',
                '997',
                '940',
                '858',
                '927',
                '860',
                '928',
                '704',
                '548',
                '882',
                '950',
                '961',
                '959',
                '955',
                '956',
                '957',
                '958',
                '951',
                '960',
                '952',
                '964',
                '953',
                '962',
                '994',
                '963',
                '965',
                '999',
                '886',
                '710',
                '967',
                '932'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "currencies" (
                "code" character varying(4) NOT NULL,
                "name" character varying(30) NOT NULL,
                "symbol" "public"."currencies_symbol_enum" NOT NULL,
                "number" "public"."currencies_number_enum" NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "uq_currencies_name" UNIQUE ("name"),
                CONSTRAINT "uq_currencies_number" UNIQUE ("number"),
                CONSTRAINT "pk_currencies_code" PRIMARY KEY ("code")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_additional_datas" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "price_max" integer NOT NULL,
                "price_min" integer NOT NULL,
                "currency_code" character varying(4),
                CONSTRAINT "pk_gift_additional_datas_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "additional_data_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "uq_gifts_additional_data_id" UNIQUE ("additional_data_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_language_iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "display_languages" DROP CONSTRAINT "pk_display_languages_iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "display_languages" DROP COLUMN "iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "display_languages"
            ADD "iso_code" character varying(4) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "display_languages"
            ADD CONSTRAINT "pk_display_languages_iso_code" PRIMARY KEY ("iso_code")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP COLUMN "language_iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD "language_iso_code" character varying(4)
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_display_options_id" ON "product_display_options_images_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_images_id" ON "product_display_options_images_product_images" ("product_images_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_language_iso_code" FOREIGN KEY ("language_iso_code") REFERENCES "display_languages"("iso_code") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_additional_data_id" FOREIGN KEY ("additional_data_id") REFERENCES "gift_additional_datas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_additional_datas"
            ADD CONSTRAINT "fk_gift_additional_datas_currency_code" FOREIGN KEY ("currency_code") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_display_options_id" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_images_id" FOREIGN KEY ("product_images_id") REFERENCES "product_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_images_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_additional_datas" DROP CONSTRAINT "fk_gift_additional_datas_currency_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_additional_data_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_language_iso_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_images_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP COLUMN "language_iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD "language_iso_code" character varying(2)
        `);
    await queryRunner.query(`
            ALTER TABLE "display_languages" DROP CONSTRAINT "pk_display_languages_iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "display_languages" DROP COLUMN "iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "display_languages"
            ADD "iso_code" character varying(2) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "display_languages"
            ADD CONSTRAINT "pk_display_languages_iso_code" PRIMARY KEY ("iso_code")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_language_iso_code" FOREIGN KEY ("language_iso_code") REFERENCES "display_languages"("iso_code") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "uq_gifts_additional_data_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "additional_data_id"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_additional_datas"
        `);
    await queryRunner.query(`
            DROP TABLE "currencies"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."currencies_number_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."currencies_symbol_enum"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_image" ON "product_display_options_images_product_images" ("product_images_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_displ" ON "product_display_options_images_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_images" FOREIGN KEY ("product_images_id") REFERENCES "product_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_displa" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }
}
