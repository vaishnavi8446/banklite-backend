import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { KycStatus, User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  async handleKycUpload(userId: string, files: Express.Multer.File[]) {
    const panFile = files.find((file) => file.fieldname === 'pan');
    const aadharFile = files.find((file) => file.fieldname === 'aadhar');
    return {
      message: 'KYC documents uploaded successfully',
      userId,
      pan: panFile?.filename,
      aadhar: aadharFile?.filename,
    };
  }

  async updateKycStatus(userId: string, status: KycStatus) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.kycStatus = status;
    await this.userRepo.save(user);
    await this.mailService.sendKycStatusEmail(user.email, status);

    return { message: `KYC ${status}` };
  }
}
