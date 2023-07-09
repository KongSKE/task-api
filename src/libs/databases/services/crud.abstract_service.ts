import { Document, FilterQuery, Model, PopulateOptions, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose';

export type Default<D extends Document> = {
  queries: FilterQuery<D>,
  populate: PopulateOptions[],
  lean: boolean,
}

export abstract class CRUDAbstractService<
  D extends Document,
  DataToCreate = any,
  AdditionalDefault = Record<any, any>,
> {
  default: Default<D> & AdditionalDefault;

  constructor(
    readonly model: Model<D>,
  ) {
    this.default = {
      ...this.default,
      queries: {},
      populate: [],
      lean: true,
    }
  }

  getOne(param: {
    queries?: FilterQuery<D>,
    populate?: PopulateOptions[],
    select?: string,
    lean?: boolean,
  }) {
    const {
      queries,
      populate = [],
      select,
      lean = this.default.lean,
    } = param;
    const promise = this.model.findOne({
      ...this.default.queries,
      ...(queries ?? {}),
    });
    if (this.default.populate.length > 0 || populate.length > 0) promise.populate([...this.default.populate, ...populate]);
    if (select) promise.select(select);
    if (lean) promise.lean();
    return promise;
  }

  getMany(param: {
    queries?: FilterQuery<D>,
    populate?: PopulateOptions[],
    select?: string,
    lean?: boolean,
    skip?: number,
    limit?: number,
    sortQuery?: any,
  }) {
    const {
      queries,
      populate = [],
      select,
      lean = this.default.lean,
      skip = 0,
      limit = 5,
      sortQuery,
    } = param;
    const promise = this.model.find({
      ...this.default.queries,
      ...(queries ?? {}),
    });
    if (sortQuery) promise.sort(sortQuery);
    if (skip) promise.skip(skip);
    if (limit) promise.limit(limit);
    if (this.default.populate.length > 0 || populate.length > 0) promise.populate([...this.default.populate, ...populate]);
    if (select) promise.select(select);
    if (lean) promise.lean();
    return promise;
  }

  getCount(param: {
    queries?: FilterQuery<D>,
  }) {
    const {  
      queries,
    } = param;
    const promise = this.model.countDocuments({
      ...queries,
    })
    return promise;
  }

  createOne(data: DataToCreate) {
    return this.model.create(data);
  }

  createMany(data: DataToCreate[]) {
    return this.model.insertMany(data);
  }

  updateOne(param: {
    queries?: FilterQuery<D>;
    populate?: PopulateOptions[];
    select?: string;
    lean?: boolean;
    update: UpdateWithAggregationPipeline | UpdateQuery<D>;
  }) {
    const {
      queries,
      populate = [],
      select,
      lean = this.default.lean,
      update,
    } = param;
    const promise = this.model.updateOne({
      ...this.default.queries,
      ...(queries ?? {}),
    }, update);
    if (this.default.populate.length > 0 || populate.length > 0) promise.populate([...this.default.populate, ...populate]);
    if (select) promise.select(select);
    if (lean) promise.lean();
    return promise;
  }
}
