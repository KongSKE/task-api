import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Candidate, CandidateDocument, CandidateToCreate } from "src/libs/databases/schemas/candidate.schema";
import { CRUDAbstractService } from "src/libs/databases/services/crud.abstract_service";

export class CandidateService extends CRUDAbstractService<CandidateDocument, CandidateToCreate> {
  constructor(
    @InjectModel(Candidate.name) private readonly candidateModel: Model<CandidateDocument>,
  ) {
    super(candidateModel);
  }
}
