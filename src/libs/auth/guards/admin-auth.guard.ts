/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/libs/databases/schemas/admin.schema';

export type RequestWithAdmin = {
  req: Request,
  admin?: any,
}

export class AdminAuthGuard implements CanActivate {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validate(req: Request & { admin?: any }) {
    const jwtFromHeader = req.headers.authorization?.replace('Bearer', '').trim() ?? 'invalid';
    try {
      const payload = await this.jwtService.verifyAsync(jwtFromHeader, { secret: this.configService.get<string>('jwt.secretKey') });
      const user = await this.adminModel.findById(payload.user_id);
      if (!user) throw new UnauthorizedException();
      req.admin = { _id: user._id };
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
