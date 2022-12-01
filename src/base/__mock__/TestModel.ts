import { Column, Entity } from 'typeorm'
import { BaseModel } from '../BaseModel'

@Entity()
export class TestModel extends BaseModel {
  @Column()
    test: string
}
