import { objectKeys } from '@wursteintopf/typescript_utils'
import { DataSource, EntityMetadata } from 'typeorm'
import { Link, ModelInterface, TableFilter } from '../../types'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'
import { addTimeFilter } from './addTimeFilter'

const getLinkedModels = async <Model extends ModelInterface>(model: Model, link: Link<Model, keyof Model>, relationMetadata: RelationMetadata, appDataSource: DataSource) => {
  const repo = appDataSource.getRepository(relationMetadata.type as any)
  const alias = relationMetadata.propertyName

  if (link.map === 'mapOne') {
    return await repo.findOne({ where: { [relationMetadata.inverseSidePropertyPath]: { id: model.id } } })
  } else if (link.map === 'mapMany') {
    let subquery = repo.createQueryBuilder(alias).where(`${alias}.${relationMetadata.inverseSidePropertyPath} = :itemId`, { itemId: model.id })
    if (link.timeFilter) subquery = addTimeFilter(subquery, alias, link.timeFilter)
    return await subquery.getMany()
  } else {
    throw new Error('Map Type was not specified in link')
  }
}

export const addLinksToModels = async <Model extends ModelInterface>(models: Model[], links: TableFilter<Model>['links'], metaData: EntityMetadata, appDataSource: DataSource) => {
  if (!links) return

  await Promise.all(objectKeys(links).map(async key => {
    const link = links[key] as Link<Model, typeof key>

    const relationMetadata = metaData.findRelationWithPropertyPath(String(key))

    if (relationMetadata) {
      for (const model of models) {
        const linkedModels = await getLinkedModels(model, link, relationMetadata, appDataSource)
        // @ts-expect-error
        model[key as keyof Model] = linkedModels
        if (link.links) {
          const newModelArray = link.map === 'mapOne' ? [linkedModels] : linkedModels
          await addLinksToModels(newModelArray as any, link.links as any, relationMetadata.inverseEntityMetadata, appDataSource)
        }
      }
    }
  }))
}
