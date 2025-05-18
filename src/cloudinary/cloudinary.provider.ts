import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from './constant';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUD_NAME'),
      api_key: configService.get<string>('API_KEY'),
      api_secret: configService.get<string>('API_SECRET'),
    });

    return cloudinary;
  },
};
