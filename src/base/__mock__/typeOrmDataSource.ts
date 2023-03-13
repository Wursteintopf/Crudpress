import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { TestModel } from './TestModel'

export const mockEntityConstructors = {
  test: TestModel,
}

export const appDataSource = new DataSource({
  type: 'better-sqlite3',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities: [TestModel],
  migrations: [],
  subscribers: [],
})
