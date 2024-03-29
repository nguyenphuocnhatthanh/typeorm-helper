import { RelationQueryBuilder } from './query-builders/relation.query-builder';
import { SelectQueryBuilder } from 'typeorm';
import { WhereExpressionInterface } from './interfaces/where-expression.interface';
import { CollectionWhereExpression } from './where-expression/collection.where-expression';
import { QueryInterface } from './interfaces/query.interface';
import { CollectionQuery } from './queries/collection.query';

export type RelationParams =
    | string
    | string[]
    | (string | { [key: string]: (name: SelectQueryBuilder<any>) => void })[];

export async function loadRelations(entities, relationNames: RelationParams) {
    if (!entities) {
        return;
    }
    entities = Array.isArray(entities) ? entities : [entities];
    if (!entities.length) {
        return;
    }
    if (typeof relationNames === 'string') {
        await new RelationQueryBuilder(entities, relationNames).load();
    } else {
        for (let relationName of relationNames) {
            if (typeof relationName === 'string') {
                await new RelationQueryBuilder(entities, relationName).load();
            } else {
                let key = Object.keys(relationName)[0];
                let relationQueryBuilder = new RelationQueryBuilder(entities, key);
                relationQueryBuilder.addCustomQuery(relationName[key]);
                await relationQueryBuilder.load();
            }
        }
    }
}

export function collectExpression(whereExpressions: WhereExpressionInterface[]) {
    return new CollectionWhereExpression(whereExpressions);
}

export function collectQuery<Entity>(queries: QueryInterface<Entity>[]) {
    return new CollectionQuery(queries);
}
