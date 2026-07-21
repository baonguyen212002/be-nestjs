import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { imageMulterOptions } from './multer.config';

@ApiTags('uploads')
@Controller('upload')
export class UploadsController {
  constructor(private readonly config: ConfigService) {}

  // FE sends multipart/form-data with a single field named "file".
  @Post('image')
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', imageMulterOptions))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException(
        'No file provided (field name must be "file")',
      );
    }

    const path = `/uploads/${file.filename}`;
    const base =
      this.config.get<string>('BASE_URL') ??
      `${req.protocol}://${req.get('host')}`;

    return {
      url: `${base}${path}`,
      path,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
