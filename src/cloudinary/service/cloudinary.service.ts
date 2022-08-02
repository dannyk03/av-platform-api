import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { createReadStream } from 'streamifier';
import util from 'util';

import { UploadCloudinaryImage } from '../cloudinary.interface';

import { CloudinaryFolder } from '../cloudinary.constant';

@Injectable()
export class CloudinaryService {
  private readonly isProduction: boolean;
  private readonly deleteResources: (publicIds: string[]) => Promise<unknown>;

  constructor(private readonly configService: ConfigService) {
    this.isProduction = this.configService.get('app.isProduction');
    this.deleteResources = util.promisify(v2.api.delete_resources);
  }
  isUploadApiResponse(data: any): data is UploadApiResponse {
    return 'asset_id' in data;
  }

  async ping() {
    return v2.api.ping();
  }

  async deleteImages({ publicIds }: { publicIds: string[] }) {
    return this.deleteResources([...new Set(publicIds)]);
  }

  async uploadImage({
    image,
    subject,
    languageIsoCode,
  }: UploadCloudinaryImage): Promise<
    UploadApiResponse | UploadApiErrorResponse
  > {
    const productionPath = CloudinaryFolder[languageIsoCode][subject];
    const developmentPath = `development/${productionPath}`;
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: this.isProduction ? productionPath : developmentPath,
          filename_override: image.originalname,
          use_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      createReadStream(image.buffer).pipe(upload);
    });
  }

  async list() {
    const listt = util.promisify(v2.api.sub_folders);
    try {
      const res = await listt('jul/products');
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
