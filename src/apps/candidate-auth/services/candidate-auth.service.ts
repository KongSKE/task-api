import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candidate, CandidateDocument } from 'src/libs/databases/schemas/candidate.schema';
import * as bcrypt from 'bcrypt';

type ValidateUserResult = {
  success: true;
  user: CandidateDocument;
} | {
  success: false;
};

@Injectable()
export class candidateAuthService {
  constructor(
    @InjectModel(Candidate.name) private readonly adminModel: Model<CandidateDocument>,
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

  generateAccessToken(user: CandidateDocument): string {
    const payload = {
      user_id: user._id,
    };
    return this.jwtService.sign(payload, { privateKey: this.configService.get<string>('jwt.secretKey') });
  }
}
