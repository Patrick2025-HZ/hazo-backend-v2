import { Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { Express } from 'express';

@Injectable()

export class CloudinaryService{
    async uploadImage(
        file: Express.Multer.File,
      ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream((error, result) => {
              if (error) return reject(error);
              if (!result) return reject(new Error('Upload failed, result is undefined'));
              resolve(result);
            });
          
            toStream(file.buffer).pipe(upload);
          });
      }
}