import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnumCloudinaryModeration } from '@avo/type';

import {
  AdminAndResourceOptions,
  AdminApiOptions,
  UploadApiErrorResponse,
  UploadApiResponse,
  v2,
} from 'cloudinary';
import { createReadStream } from 'streamifier';
import util from 'util';

import { HelperAppService } from '@/utils/helper/service';

import { CloudinarySubjectFolderPath } from '../cloudinary.constant';

import { UploadCloudinaryImage } from '../cloudinary.interface';

@Injectable()
export class CloudinaryService {
  private readonly isProduction =
    this.configService.get<boolean>('app.isProduction');

  private readonly isPerceptionPointMalwareDetectionOn =
    this.configService.get<boolean>(
      'cloudinary.addons.perceptionPointMalwareDetectionOn',
    );

  private readonly cloudinaryDeleteResources: (
    publicIds: string[],
  ) => Promise<any> = util.promisify(v2.api.delete_resources);

  private readonly cloudinaryDeleteFolder: (
    path: string,
    options?: AdminApiOptions,
  ) => Promise<any> = util.promisify(v2.api.delete_folder);

  private readonly cloudinaryDeleteResourcesByPrefix: (
    prefix: string,
    options?: AdminAndResourceOptions,
  ) => Promise<any> = util.promisify(v2.api.delete_resources_by_prefix);

  constructor(
    private readonly configService: ConfigService,
    private readonly helperAppService: HelperAppService,
  ) {}
  isUploadApiResponse(data: any): data is UploadApiResponse {
    return 'asset_id' in data;
  }

  async ping() {
    return v2.api.ping();
  }

  async deleteResources({ publicIds }: { publicIds: string[] }) {
    if (!publicIds) {
      return null;
    }
    return this.cloudinaryDeleteResources([...new Set(publicIds)]);
  }

  async deleteFolder({ path }: { path: string }) {
    // TODO Shitty cloudinary API, doesn't work (WIP)
    await this.cloudinaryDeleteResourcesByPrefix(path);
    return this.cloudinaryDeleteFolder(path);
  }

  async uploadImage({
    image,
    subject,
    languageIsoCode,
    subFolder,
  }: UploadCloudinaryImage): Promise<
    UploadApiResponse | UploadApiErrorResponse
  > {
    const productionPath = `${
      CloudinarySubjectFolderPath[languageIsoCode][subject]
    }${subFolder ? `/${subFolder}` : ''}`;

    const developmentPath = `development/${productionPath}`;

    if (!image) {
      return Promise.resolve(null);
    }

    return new Promise(async (resolve, reject) => {
      const appUrl = await this.helperAppService.getAppUrl();
      const notificationUrl = `${appUrl}/api/webhook/cloudinary`;
      console.log({ notificationUrl });
      const upload = v2.uploader.upload_stream(
        {
          filename_override: image.originalname,
          folder: this.isProduction ? productionPath : developmentPath,
          ...(this.isPerceptionPointMalwareDetectionOn &&
            appUrl && {
              moderation: EnumCloudinaryModeration.PerceptionPoint,
              notification_url: notificationUrl,
            }),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      createReadStream(image.buffer).pipe(upload);
    });
  }

  async verifyNotificationSignature({
    body,
    timestamp,
    signature,
    validFor,
  }: {
    body: string;
    timestamp: string | number;
    signature: string;
    validFor?: number;
  }) {
    return v2.utils.verifyNotificationSignature(
      body,
      Number(timestamp),
      signature,
      validFor,
    );
  }

  // WIP test code
  async deleteMany() {
    const subFolders = util.promisify(v2.api.sub_folders);
    try {
      const res = await subFolders('jul/products');
      res.folders.forEach((folder) => {
        v2.api.resources(
          {
            type: 'upload',
            prefix: folder.path,
            max_results: 500,
          },
          function (error, res1) {
            console.log(error, res1);
            if (res1?.resources.length) {
              v2.api.delete_resources_by_prefix(folder.path, (err, res) => {
                console.log(err, res);
                // v2.api.delete_folder(folder.path, (err, res) => {
                //   debugger;
                //   console.log(err, res);
                // });
              });
            } else {
              v2.api.delete_folder(folder.path, (err, res2) => {
                console.log(err, res2);
              });
            }
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  }
}
