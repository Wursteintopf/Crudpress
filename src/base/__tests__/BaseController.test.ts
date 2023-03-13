import { appDataSource, mockEntityConstructors } from './../__mock__/typeOrmDataSource'
import { BaseController } from '../BaseController'
import { Repository, EntityNotFoundError } from 'typeorm'
import Database from 'better-sqlite3'
import { TestModel } from '../__mock__/TestModel'

describe('Test BaseController', () => {
  let testdb: any
  let repository: Repository<TestModel>
  let controller: BaseController<TestModel>

  beforeEach(async () => {
    testdb = new Database(':memory:', { verbose: console.log })
    await appDataSource.initialize()
    repository = appDataSource.getRepository<TestModel>(TestModel)
    controller = new BaseController<TestModel>(TestModel, appDataSource, 'test', ['equal'], mockEntityConstructors)

    const model = new TestModel().set({
      id: 1,
      test: 'test1',
      equal: 'equal1',
    })
    await repository.save(model)

    const model2 = new TestModel().set({
      id: 2,
      test: 'test2',
      equal: 'equal2',
    })
    await repository.save(model2)
  })

  afterEach(async () => {
    testdb.close()
    appDataSource.destroy()
  })

  it('should create a model', async () => {
    const savedModel = await controller.saveSingle({ test: 'somecontent' })
    const models = await repository.find()
    // There should be 3 models after saving
    expect(models.length).toEqual(3)
    // The id should be incremented automatically
    expect(savedModel.id).toEqual(3)
  })

  it('should create multiple models', async () => {
    await controller.save([{ test: 'somecontent' }, { test: 'morecontent' }])
    const models = await repository.find()
    expect(models.length).toEqual(4)
  })

  it('should read a model', async () => {
    const found = await controller.get({ id: 1 })
    expect(found.data.id).toBe(1)
  })

  it('should throw an error if a model doesnt exist', async () => {
    await expect(controller.get({ id: 5 })).rejects.toThrow(EntityNotFoundError)
  })

  it('should read all models', async () => {
    const found = await controller.find({})
    expect(found.data.length).toBe(2)
  })

  it('should find a model', async () => {
    const found = await controller.find({ searchParams: { id: 1 } })
    expect(found.data.length).toBe(1)
    expect(found.data[0].id).toEqual(1)
  })

  it('should update an existing model', async () => {
    await controller.saveSingle({ equal: 'equal1', test: 'changed' })
    const found = await repository.findOneBy({ id: 1 })
    expect(found?.id).toBe(1)
    expect(found?.test).toBe('changed')
  })

  it('should delete a model', async () => {
    await controller.delete({ id: 1 })
    const models = await repository.find()
    expect(models.length).toBe(1)
  })
})
