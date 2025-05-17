import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from './constant';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    cloudinary.config({
      cloud_name: 'dxqzrgxaz',
      api_key: '353628179554929',
      api_secret: 'aKKK_XA7FODK0oxbHxFRIToNQ3c',
    });
    return cloudinary;
  },
};
