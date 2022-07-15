import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { createReadStream } from 'streamifier';
import util from 'util';
import { UploadProductImage } from '../cloudinary.interface';
@Injectable()
export class CloudinaryService {
  private readonly v2UploadStream: () => Promise<UploadApiResponse>;
  constructor() {
    this.v2UploadStream = util.promisify(v2.uploader.upload_stream);
  }

  async uploadImage({
    file,
    language,
  }: UploadProductImage): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: '',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      createReadStream(file.buffer).pipe(upload);
    });
  }
}
