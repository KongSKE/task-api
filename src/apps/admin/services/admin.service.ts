import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument, AdminToCreate } from 'src/libs/databases/schemas/admin.schema';
import { CRUDAbstractService } from 'src/libs/databases/services/crud.abstract_service';

export class AdminService extends CRUDAbstractService<AdminDocument, AdminToCreate> {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {
    super(adminModel)
  }
}
