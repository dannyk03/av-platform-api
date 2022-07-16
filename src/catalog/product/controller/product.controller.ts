import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Action, Subject } from '@avo/casl';
// Entities
import { ProductImage } from '@/catalog/product-image/entity';
// Services
import { DebuggerService } from '@/debugger/service';
import { HelperDateService } from '@/utils/helper/service';
import { CloudinaryService } from '@/cloudinary/service';
import { ProductImageService } from '@/catalog/product-image/service';
import { ProductService } from '../service';
//
import { Response, IResponse } from '@/utils/response';
import { UploadFileMultiple } from '@/utils/file/file.decorator';
import { EnumFileType } from '@/utils/file/file.constant';
import { ProductCreateDto } from '../dto/product.create.dto';
import { AclGuard } from '@/auth';
import { CloudinarySubject } from '@/cloudinary/cloudinary.constants';
import { ReqLogData } from '@/utils/request';
import { IReqLogData } from '@/log';
import { ReqUser } from '@/user';

@Controller({
  version: '1',
  path: 'product',
})
export class ProductController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly productService: ProductService,
    private readonly productImageService: ProductImageService,
  ) {}

  @Response('product.create')
  @HttpCode(HttpStatus.OK)
  @AclGuard(
    [
      {
        action: Action.Create,
        subject: Subject.Product,
      },
    ],
    { systemOnly: true },
  )
  @UploadFileMultiple('images', EnumFileType.Image)
  @Post('/create')
  async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body()
    {
      sku,
      name,
      description,
      brand,
      isActive,
      keywords,
      languageIsoCode,
    }: ProductCreateDto,
  ): Promise<IResponse> {
    const productExists = this.productService.findOneBy({ sku });

    if (productExists) {
      // throw new BadRequestException({
      //   statusCode: EnumAuthStatusCodeError.AuthPasswordNotMatchError,
      //   message: 'auth.error.notMatch',
      // });
    }

    const uploadImages = await Promise.all(
      images.map(async (image) => {
        const existsImage = await this.productImageService.findOneByFileName(
          image.originalname.split('.')[0],
        );

        return (
          existsImage ||
          this.cloudinaryService.uploadImage({
            subject: CloudinarySubject.Product,
            image,
            languageIsoCode,
          })
        );
      }),
    );

    const saveImages = await Promise.all(
      uploadImages.map(async (image) => {
        if (this.cloudinaryService.isUploadApiResponse(image)) {
          return this.productImageService.create({
            fileName: image.original_filename,
            assetId: image.asset_id,
            publicId: image.public_id,
            secureUrl: image.secure_url,
          });
        }
        return image as ProductImage;
      }),
    );

    const createProduct = await this.productService.create({
      brand,
      sku,
      isActive,
      displayOptions: [
        {
          language: { isoCode: languageIsoCode },
          keywords,
          name,
          description,
          images: saveImages,
        },
      ],
    });

    await this.productService.save(createProduct);

    return;
  }
}
