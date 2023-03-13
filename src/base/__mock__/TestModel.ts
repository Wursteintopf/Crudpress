import { Column, Entity } from 'typeorm'
import { BaseModel } from '../BaseModel'

@Entity()
export class TestModel extends BaseModel {
  type: 'test'

  @Column()
    test: string
  
  @Column()
    equal: string
  
  @Column()
    dateParam: Date
}
