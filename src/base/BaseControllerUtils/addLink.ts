import { Link, TableFilter } from './../../types/FindRequest'
import { DataSource, SelectQueryBuilder } from 'typeorm'
import { BaseModel } from '../BaseModel'
import { addTableFilter } from './addTableFilter'

export const addLink = <Model extends BaseModel>(
  queryBuilder: SelectQueryBuilder<Model>,
  link: Link<Model, keyof Model>,
  baseType: string,
  key: string,
  entities: Record<string, new () => BaseModel>,
  appDataSource: DataSource,
) => {
  let joinCondition = ''
  let tableName = ''

  if (link.map === 'mapOne') {
    // If mapping to one, the tableName is equal to the key, and we can build the join condition on top of that
    tableName = key
    joinCondition = `${baseType}.${tableName}Id = ${tableName}.id`
    queryBuilder.leftJoinAndMapOne(`${baseType}.${key}`, entities[tableName], tableName, joinCondition)
  } else if (link.map === 'mapMany') {
    // If mapping to many, the key is a plural (eg. channels for the table channel), so we cut of the last s
    const lastChar = key.slice(-1)
    if (lastChar !== 's') throw new Error('Relations are not set up correctly. When mapping many to one, your param should be a plural ending with an "s", eg: videos ')

    tableName = key.slice(0, -1)
    joinCondition = `${baseType}.id = ${tableName}.${baseType}Id`
    queryBuilder.leftJoinAndMapMany(`${baseType}.${key}`, entities[tableName], tableName, joinCondition)
  } else {
    throw new Error('Link in request not formatted correctly. Each link must contain a "map" parameter of either "mapOne" or "mapMany"')
  }

  addTableFilter(link as TableFilter<Model>, queryBuilder, tableName, entities, appDataSource)
}
