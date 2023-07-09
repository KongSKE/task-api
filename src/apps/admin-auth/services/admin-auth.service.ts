import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from 'src/libs/databases/schemas/admin.schema';
import { AdminAuthLoginDTO } from '../dto/admin-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

type ValidateUserResult = {
  success: true;
  user: AdminDocument;
} | {
  success: false;
};

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<ValidateUserResult> {
    const user = await this.adminModel.findOne({ username }).select('+password');
    if (!user) {
      return { success: false };
    }
    const isHashMatch = await bcrypt.compare(password, user.password);
    return isHashMatch ? { success: true, user } : { success: false };
  }

  generateAccessToken(user: AdminDocument): string {
    const payload = {
      user_id: user._id,
    };
    return this.jwtService.sign(payload, { privateKey: this.configService.get<string>('jwt.secretKey') });
  }
}
