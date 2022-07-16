import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { createReadStream } from 'streamifier';
import { EnumDisplayLanguage } from '@/language/display-language/display-language.constant';
import { CloudinaryFolder } from '../cloudinary.constants';
import { UploadCloudinaryImage } from '../cloudinary.interface';
import util from 'util';
@Injectable()
export class CloudinaryService {
  isUploadApiResponse(data: any): data is UploadApiResponse {
    return 'asset_id' in data;
  }

  async uploadImage({
    image,
    subject,
    languageIsoCode,
  }: UploadCloudinaryImage): Promise<
    UploadApiResponse | UploadApiErrorResponse
  > {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: CloudinaryFolder[languageIsoCode][subject],
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
          function (error, res) {
            console.log(error, res);
            if (error) {
              debugger;
            }
            if (res?.resources.length) {
              v2.api.delete_resources_by_prefix(folder.path, (err, res) => {
                console.log(err, res);
                // v2.api.delete_folder(folder.path, (err, res) => {
                //   console.log(err, res);
                // });
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
