import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument, CommentToCreate } from 'src/libs/databases/schemas/comment.schema';
import { CRUDAbstractService } from 'src/libs/databases/services/crud.abstract_service';

@Injectable()
export class CommentService extends CRUDAbstractService<CommentDocument, CommentToCreate> {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
  ) {
    super(commentModel)
  }
}
