var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EntityNotFoundError } from 'typeorm';
/**
 * BaseController that provides basic CRUD functions to read and write items from the database
 */
export class BaseController {
    /**
     * Initializes the BaseController that provides basic CRUD fucntions to read and write items from the database
     * @param ModelConstructor The constructor to create new models with
     * @param appDataSource The TypeORM data source to connect to
     */
    constructor(ModelConstructor, appDataSource) {
        this.ModelConstructor = ModelConstructor;
        this.repository = appDataSource.getRepository(ModelConstructor);
    }
    create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new this.ModelConstructor();
            model.set(params);
            return yield this.repository.save(model);
        });
    }
    createMultiple(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const models = params.map((param) => {
                const model = new this.ModelConstructor();
                model.set(param);
                return model;
            });
            return yield this.repository.save(models);
        });
    }
    read(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield this.repository.findOne({ where: { id: id } });
            if (!model)
                throw new EntityNotFoundError(this.ModelConstructor, '');
            return model;
        });
    }
    readAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find();
        });
    }
    readBy(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findBy(params);
        });
    }
    readOneBy(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield this.repository.findOne({ where: params });
            if (!model)
                throw new EntityNotFoundError(this.ModelConstructor, '');
            return model;
        });
    }
    update(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield this.read(params.id);
            model.set(params);
            return yield this.repository.save(model);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.delete({ id: id });
            return id;
        });
    }
}
