import { TableFilter } from '../../types/FindRequest'
import { DataSource, SelectQueryBuilder } from 'typeorm'
import { objectKeys, randomString, TsFixMe } from '@wursteintopf/typescript_utils'
import { BaseModel } from '../BaseModel'
import { addTimeFilter } from './addTimeFilter'
import { addLink } from './addLink'

export const addTableFilter = <Model extends BaseModel>(
  tableFilter: TableFilter<Model>,
  queryBuilder: SelectQueryBuilder<Model>,
  type: string,
  entities: Record<string, new () => BaseModel>,
  appDataSource: DataSource,
) => {
  // Search for everything we want to search for
  if (tableFilter.searchParams) {
    objectKeys(tableFilter.searchParams).forEach(key => {
      const uniqueParam = randomString()
      queryBuilder.andWhere(`${type}.${String(key)} = :${String(key)}${uniqueParam}`, {
        [`${String(key)}${uniqueParam}`]: tableFilter.searchParams![key],
      })
    })
  }

  // Add timefilter
  if (tableFilter.timeFilter) {
    addTimeFilter(queryBuilder, tableFilter.timeFilter, type, entities, appDataSource)
  }

  // Add all links if there are any
  if (tableFilter.links) {
    objectKeys(tableFilter.links).forEach(key => {
      addLink(queryBuilder, tableFilter.links![key] as TsFixMe, type, String(key), entities, appDataSource)
    })
  }
}
