/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { CandidateDocument } from 'src/libs/databases/schemas/candidate.schema';
import { Candidate } from 'src/libs/databases/schemas/candidate.schema';

export type RequestWithCandidate = {
  req: Request,
  candidate?: any,
}

export class CandidateAuthGuard implements CanActivate {
  constructor(
    @InjectModel(Candidate.name) private readonly candidateModel: Model<CandidateDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validate(req: Request & { candidate?: any }) {
    const jwtFromHeader = req.headers.authorization?.replace('Bearer', '').trim() ?? 'invalid';
    try {
      const payload = await this.jwtService.verifyAsync(jwtFromHeader, { secret: this.configService.get<string>('jwt.secretKey') });
      const user = await this.candidateModel.findById(payload.user_id);
      if (!user) throw new UnauthorizedException();
      req.candidate = { _id: user._id };
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async canActivate(context: ExecutionContext) {
    const [req] = context.getArgs();
    const result = await this.validate(req);
    return result;
  }
}
