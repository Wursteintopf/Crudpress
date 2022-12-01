var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { appDataSource } from './../__mock__/typeOrmDataSource';
import { BaseController } from '../BaseController';
import { EntityNotFoundError } from 'typeorm';
import Database from 'better-sqlite3';
import { TestModel } from '../__mock__/TestModel';
describe('Test BaseController', () => {
    let testdb;
    let repository;
    let controller;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        testdb = new Database(':memory:', { verbose: console.log });
        yield appDataSource.initialize();
        repository = appDataSource.getRepository(TestModel);
        controller = new BaseController(TestModel, appDataSource);
        const model = new TestModel();
        model.id = 1;
        model.test = 'test1';
        yield repository.save(model);
        const model2 = new TestModel();
        model2.id = 2;
        model2.test = 'test2';
        yield repository.save(model2);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        testdb.close();
        appDataSource.destroy();
    }));
    it('should create a model', () => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.create({ test: 'somecontent' });
        const models = yield repository.find();
        expect(models.length).toEqual(3);
    }));
    it('should return the id of the newly created model', () => __awaiter(void 0, void 0, void 0, function* () {
        const model = yield controller.create({ test: 'somecontent' });
        expect(model.id).toEqual(3);
    }));
    it('should create multiple models', () => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.createMultiple([{ test: 'somecontent' }, { test: 'morecontent' }]);
        const models = yield repository.find();
        expect(models.length).toEqual(4);
    }));
    it('should read a model', () => __awaiter(void 0, void 0, void 0, function* () {
        const found = yield controller.read(1);
        expect(found.id).toBe(1);
    }));
    it('should throw an error if a model doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(controller.read(5)).rejects.toThrow(EntityNotFoundError);
    }));
    it('should read all models', () => __awaiter(void 0, void 0, void 0, function* () {
        const found = yield controller.readAll();
        expect(found.length).toBe(2);
    }));
    it('should read all model by an id', () => __awaiter(void 0, void 0, void 0, function* () {
        const found = yield controller.readBy({ id: 1 });
        expect(found.length).toBe(1);
    }));
    it('should read a model by its id', () => __awaiter(void 0, void 0, void 0, function* () {
        const found = yield controller.readOneBy({ id: 1 });
        expect(found.id).toBe(1);
    }));
    it('should update a model', () => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.update({ id: 1, test: 'changed' });
        const found = yield repository.findOneBy({ id: 1 });
        expect(found === null || found === void 0 ? void 0 : found.id).toBe(1);
        expect(found === null || found === void 0 ? void 0 : found.test).toBe('changed');
    }));
    it('should delete a model', () => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.delete(1);
        const models = yield repository.find();
        expect(models.length).toBe(1);
    }));
});
