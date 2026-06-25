import type { DataSource, EntityTarget, ObjectLiteral } from "typeorm";

export default class Repository {
  public constructor(protected readonly dataSource: DataSource) {}

  protected repository<T extends ObjectLiteral>(entity: EntityTarget<T>) {
    return this.dataSource.getRepository(entity);
  }
}
