import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { FileSizeValidationPipe } from 'src/libs/pipe/file-size-validation.pipe';
import { APIResponse } from 'src/libs/utils/api-response';

@ApiTags('File Storage')
@Controller('file-storage')
export class FileStorageController {

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File
  ): Promise<APIResponse<{ image_type: string, image_data: string }>> {
    const buffer = file.buffer;
    const base64 = buffer.toString('base64');
    return { success: true, image_type: file.mimetype ,image_data: base64 };
  }
}
