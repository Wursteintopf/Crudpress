import { appDataSource, mockEntityConstructors } from './../__mock__/typeOrmDataSource'
import { BaseController } from '../BaseController'
import { Repository, EntityNotFoundError } from 'typeorm'
import Database from 'better-sqlite3'
import { TestModel } from '../__mock__/TestModel'
import moment from 'moment'

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
      type: 'test',
      id: 1,
      test: 'test1',
      equal: 'equal1',
      dateParam: moment('1995.02.24').toDate(),
    })
    await repository.save(model)

    const model2 = new TestModel().set({
      type: 'test',
      id: 2,
      test: 'test2',
      equal: 'equal2',
      dateParam: moment('1995.02.25').toDate(),
    })
    await repository.save(model2)
  })

  afterEach(async () => {
    testdb.close()
    appDataSource.destroy()
  })

  /**
   * Testing the GET method
   */

  it('should get a model', async () => {
    const found = await controller.get({ id: 1 })
    expect(found.items[0].id).toBe(1)
  })

  it('should throw an error if a model doesnt exist', async () => {
    await expect(controller.get({ id: 5 })).rejects.toThrow(EntityNotFoundError)
  })

  /**
   * Testing the FIND method
   */

  it('should find all models', async () => {
    const found = await controller.find({})
    expect(found.items.length).toBe(2)
  })

  it('should find a model', async () => {
    const found = await controller.find({ searchParams: { id: 1 } })
    expect(found.items.length).toBe(1)
    expect(found.items[0].id).toEqual(1)
  })

  it('should find model before a date', async () => {
    const found = await controller.find(
      {
        timeFilter: {
          key: 'dateParam',
          limit: 1,
          before: moment('1995.02.26').toDate(),
        },
      },
    )
    expect(found.items.length).toBe(1)
    expect(found.items[0].id).toEqual(2)
  })

  it('should find multiple model before a date', async () => {
    const found = await controller.find(
      {
        timeFilter: {
          key: 'dateParam',
          limit: 2,
          before: moment('1995.02.26').toDate(),
        },
      },
    )
    expect(found.items.length).toBe(2)
  })

  it('should find a model after a date', async () => {
    const found = await controller.find(
      {
        timeFilter: {
          key: 'dateParam',
          limit: 1,
          after: moment('1995.02.24').toDate(),
        },
      },
    )
    expect(found.items.length).toBe(1)
    expect(found.items[0].id).toEqual(2)
  })

  it('should find a model in a range', async () => {
    const found = await controller.find(
      {
        timeFilter: {
          key: 'dateParam',
          after: moment('1995.02.24').toDate(),
          before: moment('1995.02.26').toDate(),
        },
      },
    )
    expect(found.items.length).toBe(1)
    expect(found.items[0].id).toEqual(2)
  })

  /**
   * Testing the SAVE methods
   */

  it('should create a model', async () => {
    const savedModel = await controller.saveSingle({
      test: 'somecontent',
      equal: 'something else',
      dateParam: moment('1995.02.25').toDate(),
    })
    const models = await repository.find()
    // There should be 3 models after saving
    expect(models.length).toEqual(3)
    // The id should be incremented automatically
    expect(savedModel.id).toEqual(3)
  })

  it('should create multiple models', async () => {
    await controller.save([
      { test: 'somecontent', equal: 'somestring', dateParam: moment('1995.02.25').toDate() },
      { test: 'morecontent', equal: 'someotherstring', dateParam: moment('1995.02.25').toDate() },
    ])
    const models = await repository.find()
    // There should be 4 models after saving
    expect(models.length).toEqual(4)
  })

  it('should update an existing model', async () => {
    const savedModel = await controller.saveSingle({ test: 'changed', equal: 'equal1' })
    const models = await repository.find()
    // There should still only be 2 models after saving
    expect(models.length).toEqual(2)
    // The id of the saved model should be the one that we updated
    expect(savedModel.id).toEqual(1)
  })

  /**
   * Testing the DELETE method
   */

  it('should delete a model', async () => {
    await controller.delete({ id: 1 })
    const models = await repository.find()
    expect(models.length).toBe(1)
  })
})
