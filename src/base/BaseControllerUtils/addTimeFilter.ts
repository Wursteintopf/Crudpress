import { DataSource, SelectQueryBuilder } from 'typeorm'
import { TimeFilter } from '../../types/FindRequest'
import { objectKeys } from '../../util'
import { randomString } from '../../../../typescript_utils/src/utilFunctions/randomString'
import { BaseModel } from '../BaseModel'
import moment from 'moment'

const buildLimitQuery = (
  timeFilter: TimeFilter,
  type: string,
  key: string,
  entities: Record<string, new () => BaseModel>,
  appDataSource: DataSource,
  joinCondition?: string,
) => {
  const subQueryAlias = randomString()
  const uniqueParam = randomString()

  const subQuery = appDataSource
    .createQueryBuilder()
    .select(`${subQueryAlias}.${key}`)
    .from(entities[type], subQueryAlias)
    .andWhere(`${subQueryAlias}.${key} < :${key}${uniqueParam}`, {
      [`${key}${uniqueParam}`]: moment(timeFilter.before).toDate(),
    })
          
  if (joinCondition) subQuery.andWhere(joinCondition)

  subQuery
    .orderBy(`${subQueryAlias}.${key}`, 'DESC')
    .offset(timeFilter.limit! - 1)
    .limit(1)

  return subQuery
}

export const addTimeFilter = <Model extends BaseModel>(
  queryBuilder: SelectQueryBuilder<Model>,
  timeFilterRecord: Record<string, TimeFilter | undefined>,
  type: string,
  entities: Record<string, new () => BaseModel>,
  appDataSource: DataSource,
  joinCondition?: string,
) => {
  objectKeys(timeFilterRecord).forEach((key) => {
    const timeFilter = timeFilterRecord[key]

    if (timeFilter?.before && timeFilter?.after) {
      // load everything between those dates (the limit will be ignored in this case)
      const uniqueParam1 = randomString()
      const uniqueParam2 = randomString()
      queryBuilder.andWhere(
        `${type}.${key} BETWEEN :${key}${uniqueParam1} AND :${key}${uniqueParam2}`,
        {
          [`${key}${uniqueParam1}`]: timeFilter.before,
          [`${key}${uniqueParam2}`]: timeFilter.after,
        },
      )
    } else if (timeFilter?.before) {
      // load everything before this date
      const uniqueParam1 = randomString()
      queryBuilder.andWhere(`${type}.${key} < :${key}${uniqueParam1}`, {
        [`${key}${uniqueParam1}`]: moment(timeFilter.before).toDate(),
      })

      // If the timefilter has a limit, then limit the results with an offset
      if (timeFilter?.limit) {
        const subQuery = buildLimitQuery(timeFilter, type, key, entities, appDataSource, joinCondition)
        queryBuilder.andWhere(`${type}.${key} >= (${subQuery.getQuery()})`)
        queryBuilder.setParameters(subQuery.getParameters())
      }
    } else if (timeFilter?.after) {
      // load everything after this date
      const uniqueParam = randomString()
      queryBuilder.andWhere(`${type}.${key} > :${key}${uniqueParam}`, {
        [`${key}${uniqueParam}`]: timeFilter.after,
      })
    } else {
      // TODO: throw some sort of error
    }
  })
}
