import { SelectQueryBuilder } from 'typeorm'
import { ModelInterface } from '../../types'

export const addSearchParams = <Model extends ModelInterface>(query: SelectQueryBuilder<Model>, alias: string, searchParams: Partial<Model>) => {
  Object.entries(searchParams).forEach(([key, value]) => {
    query = query.andWhere(`${alias}.${key} = :value`, { value })
  })

  return query
}
