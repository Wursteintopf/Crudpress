import { appDataSource } from './../__mock__/typeOrmDataSource';
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
    controller = new BaseController<TestModel>(TestModel, appDataSource)

    const model = new TestModel()
    model.id = 1
    model.test = 'test1'
    await repository.save(model)

    const model2 = new TestModel()
    model2.id = 2
    model2.test = 'test2'
    await repository.save(model2)
  })

  afterEach(async () => {
    testdb.close()
    appDataSource.destroy()
  })

  it('should create a model', async () => {
    await controller.create({ test: 'somecontent' })
    const models = await repository.find()
    expect(models.length).toEqual(3)
  })

  it('should return the id of the newly created model', async () => {
    const model = await controller.create({ test: 'somecontent' })
    expect(model.id).toEqual(3)
  })

  it('should create multiple models', async () => {
    await controller.createMultiple([{ test: 'somecontent' }, { test: 'morecontent' }])
    const models = await repository.find()
    expect(models.length).toEqual(4)
  })

  it('should read a model', async () => {
    const found = await controller.read(1)
    expect(found.id).toBe(1)
  })

  it('should throw an error if a model doesnt exist', async () => {
    await expect(controller.read(5)).rejects.toThrow(EntityNotFoundError)
  })

  it('should read all models', async () => {
    const found = await controller.readAll()
    expect(found.length).toBe(2)
  })

  it('should read all model by an id', async () => {
    const found = await controller.readBy({ id: 1 })
    expect(found.length).toBe(1)
  })

  it('should read a model by its id', async () => {
    const found = await controller.readOneBy({ id: 1 })
    expect(found.id).toBe(1)
  })

  it('should update a model', async () => {
    await controller.update({ id: 1, test: 'changed' })
    const found = await repository.findOneBy({ id: 1 })
    expect(found?.id).toBe(1)
    expect(found?.test).toBe('changed')
  })

  it('should delete a model', async () => {
    await controller.delete(1)
    const models = await repository.find()
    expect(models.length).toBe(1)
  })
})
