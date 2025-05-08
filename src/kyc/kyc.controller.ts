import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { KycService } from './kyc.service';
import { Body, Patch, Param } from '@nestjs/common';
import { RolesGuard } from 'src/roles/roles.guard';
import { KycStatus, Role } from 'src/users/entities/user.entity';
import { Roles } from 'src/roles/roles.decorator';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads/kyc',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async uploadKyc(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req,
  ) {
    return this.kycService.handleKycUpload(req.user.id, files);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/:userId/status')
  async updateKycStatus(
    @Param('userId') userId: string,
    @Body() body: { status: KycStatus },
  ) {
    return this.kycService.updateKycStatus(userId, body.status);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch('update-status')
  async sendKycStatusEmail(
    @Body('userId') userId: string,
    @Body('status') status: KycStatus,
    @Request() req,
  ) {
    if (status !== KycStatus.APPROVED && status !== KycStatus.REJECTED) {
      throw new ForbiddenException(
        'Invalid status. Must be APPROVED or REJECTED',
      );
    }

    return this.kycService.updateKycStatus(userId, status);
  }
}
