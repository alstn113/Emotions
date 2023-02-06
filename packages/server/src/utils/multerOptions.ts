import { HttpException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const multerOptions: MulterOptions = {
  /** 5mb로 제한 */
  limits: { fileSize: 1024 * 1024 * 5 },
  /** only png, jpg, jpeg */
  fileFilter: function (_req, file, callback) {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      callback(null, true);
    } else {
      callback(new HttpException('Unvalid Type', 422), false);
    }
  },
};

export default multerOptions;
