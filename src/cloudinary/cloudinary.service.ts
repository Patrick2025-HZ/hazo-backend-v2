import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Allowed types
    const allowedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];

    let resourceType: 'image' | 'video';

    if (allowedImageTypes.includes(file.mimetype)) {
      resourceType = 'image';
    } else if (allowedVideoTypes.includes(file.mimetype)) {
      resourceType = 'video';
    } else {
      throw new BadRequestException(
        'Invalid file type. Only images or videos are allowed.',
      );
    }

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: resourceType },
        (error, result) => {
          if (error)
            return reject(
              new BadRequestException(
                error.message || 'Cloudinary upload failed',
              ),
            );
          if (!result)
            return reject(
              new BadRequestException('Upload failed, result is undefined'),
            );
          resolve(result);
        },
      );

      try {
        toStream(file.buffer).pipe(upload);
      } catch (err) {
        reject(new BadRequestException('Error processing the file'));
      }
    });
  }
}
