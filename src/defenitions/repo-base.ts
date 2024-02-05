export abstract class RepoBase<T> {
    abstract save(record: T): Promise<number>;
    // abstract retrieveAll(searchParams?: { id?: number }): Promise<T[]>;
    // abstract retrieveById(id: number): Promise<T | undefined>;
    // abstract update(record: T): Promise<number>;
    // abstract delete(id: number): Promise<number>;
    // abstract deleteAll(): Promise<number>;
}