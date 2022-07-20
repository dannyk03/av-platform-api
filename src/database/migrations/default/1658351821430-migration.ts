import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658351821430 implements MigrationInterface {
  name = 'migration1658351821430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_auth_configs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "password" character varying(100),
                "salt" character varying(100),
                "password_expired_at" TIMESTAMP,
                "email_verified_at" TIMESTAMP,
                "login_code" character varying(32),
                "login_code_expired_at" TIMESTAMP,
                CONSTRAINT "uq_user_auth_configs_login_code" UNIQUE ("login_code"),
                CONSTRAINT "pk_user_auth_configs_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_auth_configs_login_code" ON "user_auth_configs" ("login_code")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_abilities_type_enum" AS ENUM('can', 'cannot')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_abilities_action_enum" AS ENUM(
                'manage',
                'access',
                'modify',
                'create',
                'update',
                'read',
                'delete'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "acl_abilities" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "type" "public"."acl_abilities_type_enum" NOT NULL,
                "action" "public"."acl_abilities_action_enum" NOT NULL,
                "subject_id" uuid,
                CONSTRAINT "pk_acl_abilities_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_subjects_type_enum" AS ENUM(
                'System',
                'Organization',
                'OrganizationInvite',
                'User',
                'Policy',
                'Role',
                'Subject',
                'Ability',
                'CreditCard',
                'Invoice',
                'Payment',
                'Order',
                'Gift',
                'Product',
                'OrganizationNamespace',
                'SecurityNamespace',
                'FinanceNamespace',
                'GiftingNamespace',
                'CatalogNamespace'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "acl_subjects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "type" "public"."acl_subjects_type_enum" NOT NULL,
                "policy_id" uuid,
                CONSTRAINT "pk_acl_subjects_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "acl_policies" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "pk_acl_policies_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "acl_role_presets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "slug" character varying(30) NOT NULL,
                "name" character varying(30) NOT NULL,
                "policy_id" uuid,
                CONSTRAINT "uq_acl_role_presets_slug" UNIQUE ("slug"),
                CONSTRAINT "uq_acl_role_presets_name" UNIQUE ("name"),
                CONSTRAINT "rel_acl_role_presets_policy_id" UNIQUE ("policy_id"),
                CONSTRAINT "pk_acl_role_presets_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_role_presets_slug" ON "acl_role_presets" ("slug")
        `);
    await queryRunner.query(`
            CREATE TABLE "acl_roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "slug" character varying(30) NOT NULL,
                "name" character varying(30) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "organization_id" uuid,
                "policy_id" uuid,
                CONSTRAINT "uq_acl_roles_name_organization_id_slug" UNIQUE ("slug", "name", "organization_id"),
                CONSTRAINT "rel_acl_roles_policy_id" UNIQUE ("policy_id"),
                CONSTRAINT "pk_acl_roles_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_roles_slug" ON "acl_roles" ("slug")
        `);
    await queryRunner.query(`
            CREATE TABLE "organizations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(30) NOT NULL,
                "slug" character varying(30) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "uq_organizations_name" UNIQUE ("name"),
                CONSTRAINT "uq_organizations_slug" UNIQUE ("slug"),
                CONSTRAINT "pk_organizations_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "organization_invite_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying(50) NOT NULL,
                "code" character varying(32) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                "role_id" uuid,
                "organization_id" uuid,
                CONSTRAINT "uq_organization_invite_links_email" UNIQUE ("email"),
                CONSTRAINT "uq_organization_invite_links_code" UNIQUE ("code"),
                CONSTRAINT "pk_organization_invite_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organization_invite_links_email" ON "organization_invite_links" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organization_invite_links_code" ON "organization_invite_links" ("code")
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "first_name" character varying(30),
                "last_name" character varying(30),
                "phone_number" character varying(30),
                "email" character varying(50) NOT NULL,
                "title" character varying(100),
                "is_active" boolean NOT NULL DEFAULT true,
                "auth_config_id" uuid,
                "role_id" uuid,
                "organization_id" uuid,
                CONSTRAINT "uq_users_phone_number" UNIQUE ("phone_number"),
                CONSTRAINT "uq_users_email" UNIQUE ("email"),
                CONSTRAINT "rel_users_auth_config_id" UNIQUE ("auth_config_id"),
                CONSTRAINT "pk_users_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_phone_number" ON "users" ("phone_number")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_email" ON "users" ("email")
        `);
    await queryRunner.query(`
            CREATE TABLE "sign_up_email_verification_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying(50) NOT NULL,
                "code" character varying(32) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                "user_agent" json NOT NULL,
                "user_id" uuid,
                CONSTRAINT "uq_sign_up_email_verification_links_email" UNIQUE ("email"),
                CONSTRAINT "uq_sign_up_email_verification_links_code" UNIQUE ("code"),
                CONSTRAINT "rel_sign_up_email_verification_links_user_id" UNIQUE ("user_id"),
                CONSTRAINT "pk_sign_up_email_verification_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_email" ON "sign_up_email_verification_links" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_code" ON "sign_up_email_verification_links" ("code")
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
            CREATE TABLE "logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "level" character varying NOT NULL,
                "action" character varying NOT NULL,
                "description" character varying,
                "tags" character varying(20) array,
                "correlation_id" uuid NOT NULL,
                "user_agent" json NOT NULL,
                "method" character varying(20) NOT NULL,
                "original_url" character varying(50) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                CONSTRAINT "pk_logs_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "display_languages" (
                "iso_code" character varying(4) NOT NULL,
                "iso_name" character varying(20) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "uq_display_languages_iso_name" UNIQUE ("iso_name"),
                CONSTRAINT "pk_display_languages_iso_code" PRIMARY KEY ("iso_code")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_display_languages_iso_name" ON "display_languages" ("iso_name")
        `);
    await queryRunner.query(`
            CREATE TABLE "product_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "file_name" character varying(30) NOT NULL,
                "asset_id" character varying(32) NOT NULL,
                "public_id" character varying(100) NOT NULL,
                "secure_url" character varying(200) NOT NULL,
                "additional_data" jsonb,
                CONSTRAINT "uq_product_images_file_name" UNIQUE ("file_name"),
                CONSTRAINT "uq_product_images_asset_id" UNIQUE ("asset_id"),
                CONSTRAINT "uq_product_images_public_id" UNIQUE ("public_id"),
                CONSTRAINT "uq_product_images_secure_url" UNIQUE ("secure_url"),
                CONSTRAINT "pk_product_images_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_images_file_name" ON "product_images" ("file_name")
        `);
    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "sku" character varying(30) NOT NULL,
                "brand" character varying(30),
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "uq_products_sku" UNIQUE ("sku"),
                CONSTRAINT "pk_products_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_products_sku" ON "products" ("sku")
        `);
    await queryRunner.query(`
            CREATE TABLE "product_display_options" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(50) NOT NULL,
                "description" character varying(200),
                "keywords" character varying(20) array NOT NULL DEFAULT '{}',
                "product_id" uuid,
                "language_iso_code" character varying(4),
                CONSTRAINT "pk_product_display_options_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_recipients" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "additional_data" jsonb,
                "user_id" uuid,
                CONSTRAINT "pk_gift_recipients_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_senders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "additional_data" jsonb,
                "user_id" uuid,
                CONSTRAINT "pk_gift_senders_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_send_confirmation_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "code" character varying(32) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                CONSTRAINT "uq_gift_send_confirmation_links_code" UNIQUE ("code"),
                CONSTRAINT "pk_gift_send_confirmation_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_send_confirmation_links_code" ON "gift_send_confirmation_links" ("code")
        `);
    await queryRunner.query(`
            CREATE TABLE "gifts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "sent_at" TIMESTAMP,
                "accepted_at" TIMESTAMP,
                "approved_at" TIMESTAMP,
                "shipped_at" TIMESTAMP,
                "delivered_at" TIMESTAMP,
                "recipient_id" uuid,
                "sender_id" uuid,
                "additional_data_id" uuid,
                "confirmation_link_id" uuid,
                CONSTRAINT "rel_gifts_recipient_id" UNIQUE ("recipient_id"),
                CONSTRAINT "rel_gifts_sender_id" UNIQUE ("sender_id"),
                CONSTRAINT "rel_gifts_additional_data_id" UNIQUE ("additional_data_id"),
                CONSTRAINT "pk_gifts_id" PRIMARY KEY ("id")
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
                "occasion" character varying(20) NOT NULL,
                "currency_code" character varying(4),
                CONSTRAINT "pk_gift_additional_datas_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "product_display_option_images" (
                "product_display_options_id" uuid NOT NULL,
                "product_images_id" uuid NOT NULL,
                CONSTRAINT "pk_product_display_option_images_product_display_options_id_product_images_id" PRIMARY KEY (
                    "product_display_options_id",
                    "product_images_id"
                )
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_option_images_product_display_options_id" ON "product_display_option_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_option_images_product_images_id" ON "product_display_option_images" ("product_images_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities"
            ADD CONSTRAINT "fk_acl_abilities_subject_id" FOREIGN KEY ("subject_id") REFERENCES "acl_subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_subjects"
            ADD CONSTRAINT "fk_acl_subjects_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acl_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_role_presets"
            ADD CONSTRAINT "fk_acl_role_presets_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acl_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "fk_acl_roles_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "fk_acl_roles_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acl_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD CONSTRAINT "fk_organization_invite_links_role_id" FOREIGN KEY ("role_id") REFERENCES "acl_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD CONSTRAINT "fk_organization_invite_links_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_auth_config_id" FOREIGN KEY ("auth_config_id") REFERENCES "user_auth_configs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_role_id" FOREIGN KEY ("role_id") REFERENCES "acl_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
            ADD CONSTRAINT "fk_sign_up_email_verification_links_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD CONSTRAINT "fk_logs_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_language_iso_code" FOREIGN KEY ("language_iso_code") REFERENCES "display_languages"("iso_code") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_recipients"
            ADD CONSTRAINT "fk_gift_recipients_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_senders"
            ADD CONSTRAINT "fk_gift_senders_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_recipient_id" FOREIGN KEY ("recipient_id") REFERENCES "gift_recipients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_sender_id" FOREIGN KEY ("sender_id") REFERENCES "gift_senders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_additional_data_id" FOREIGN KEY ("additional_data_id") REFERENCES "gift_additional_datas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_confirmation_link_id" FOREIGN KEY ("confirmation_link_id") REFERENCES "gift_send_confirmation_links"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_additional_datas"
            ADD CONSTRAINT "fk_gift_additional_datas_currency_code" FOREIGN KEY ("currency_code") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_option_images"
            ADD CONSTRAINT "fk_product_display_option_images_product_display_options_id" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_option_images"
            ADD CONSTRAINT "fk_product_display_option_images_product_images_id" FOREIGN KEY ("product_images_id") REFERENCES "product_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_option_images" DROP CONSTRAINT "fk_product_display_option_images_product_images_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_option_images" DROP CONSTRAINT "fk_product_display_option_images_product_display_options_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_additional_datas" DROP CONSTRAINT "fk_gift_additional_datas_currency_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_confirmation_link_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_additional_data_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_sender_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_recipient_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_senders" DROP CONSTRAINT "fk_gift_senders_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_recipients" DROP CONSTRAINT "fk_gift_recipients_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_language_iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_product_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP CONSTRAINT "fk_logs_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links" DROP CONSTRAINT "fk_sign_up_email_verification_links_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_auth_config_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP CONSTRAINT "fk_organization_invite_links_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP CONSTRAINT "fk_organization_invite_links_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "fk_acl_roles_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "fk_acl_roles_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_role_presets" DROP CONSTRAINT "fk_acl_role_presets_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_subjects" DROP CONSTRAINT "fk_acl_subjects_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities" DROP CONSTRAINT "fk_acl_abilities_subject_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_option_images_product_images_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_option_images_product_display_options_id"
        `);
    await queryRunner.query(`
            DROP TABLE "product_display_option_images"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_additional_datas"
        `);
    await queryRunner.query(`
            DROP TABLE "gifts"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_gift_send_confirmation_links_code"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_send_confirmation_links"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_senders"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_recipients"
        `);
    await queryRunner.query(`
            DROP TABLE "product_display_options"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_products_sku"
        `);
    await queryRunner.query(`
            DROP TABLE "products"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_images_file_name"
        `);
    await queryRunner.query(`
            DROP TABLE "product_images"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_display_languages_iso_name"
        `);
    await queryRunner.query(`
            DROP TABLE "display_languages"
        `);
    await queryRunner.query(`
            DROP TABLE "logs"
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
            DROP INDEX "public"."idx_sign_up_email_verification_links_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_sign_up_email_verification_links_email"
        `);
    await queryRunner.query(`
            DROP TABLE "sign_up_email_verification_links"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_phone_number"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organization_invite_links_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organization_invite_links_email"
        `);
    await queryRunner.query(`
            DROP TABLE "organization_invite_links"
        `);
    await queryRunner.query(`
            DROP TABLE "organizations"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_roles_slug"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_roles"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_role_presets_slug"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_role_presets"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_policies"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_subjects"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_subjects_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_abilities"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_abilities_action_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_abilities_type_enum"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            DROP TABLE "user_auth_configs"
        `);
  }
}
