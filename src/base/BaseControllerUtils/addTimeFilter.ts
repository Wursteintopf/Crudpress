import { SelectQueryBuilder } from 'typeorm'
import { ModelInterface, TimeFilter } from '../../types'

export const addTimeFilter = <Model extends ModelInterface>(query: SelectQueryBuilder<any>, alias: string, filter: TimeFilter<Model>) => {
  const { key, before, after, limit } = filter

  // If there is a before specified, add it
  if (before) {
    query = query.andWhere(`${alias}.${String(key)} < :before`, { before })
  }
  // If there is an after specified, add it
  if (after) {
    query = query.andWhere(`${alias}.${String(key)} > :after`, { after })
  }
  // If there is a limit and either before or after is not specified, add that limit
  if (limit && (!before || !after)) {
    query = query.orderBy(`${alias}.${String(key)}`, after ? 'ASC' : 'DESC').limit(limit)
  }

  return query
}
