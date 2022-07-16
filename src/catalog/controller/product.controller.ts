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
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { HelperDateService } from '@/utils/helper/service';
import { AclGuard } from '@/auth';
import { IReqLogData } from '@/log';
import { OrganizationCreateDto } from '@/organization/dto';
import { ReqUser } from '@/user';
// Entities
import { User } from '@/user/entity';
//
import { ReqLogData } from '@/utils/request';
import { Response, IResponse } from '@/utils/response';
import { UploadFileMultiple } from '@/utils/file/file.decorator';
import { EnumFileType } from '@/utils/file/file.constant';
import { ProductCreateDto } from '../dto/product.create.dto';

@Controller({
  version: '1',
  path: 'product',
})
export class ProductController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
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
    { sku, name, description, brand, isActive, keywords }: ProductCreateDto,
  ): Promise<IResponse> {
    return;
  }
}
