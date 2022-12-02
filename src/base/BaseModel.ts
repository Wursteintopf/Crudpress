import { Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * BaseModel Entity to be saved with TypeORM. All Models should extend this BaseModel.
 * Provides a numerical id as primary generated column and a set function to set all values of a model.
 */
@Entity()
export class BaseModel {
  @PrimaryGeneratedColumn()
    id: number

  /**
   * Helper function to set all values of a model 
   * @param props A partial containing all values to be updated
   * @returns The updated object
   */
  public set (props: Partial<this>) {
    (Object.keys(props) as Array<keyof this>).forEach((key) => {
      // @ts-expect-error
      this[key] = props[key]
    })
    return this
  }
}
