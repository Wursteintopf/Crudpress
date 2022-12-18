"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const typeorm_1 = require("typeorm");
/**
 * BaseModel Entity to be saved with TypeORM. All Models should extend this BaseModel.
 * Provides a numerical id as primary generated column and a set function to set all values of a model.
 */
let BaseModel = class BaseModel {
    /**
     * Helper function to set all values of a model
     * @param props A partial containing all values to be updated
     * @returns The updated object
     */
    set(props) {
        Object.keys(props).forEach((key) => {
            // @ts-expect-error
            this[key] = props[key];
        });
        return this;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BaseModel.prototype, "id", void 0);
BaseModel = __decorate([
    (0, typeorm_1.Entity)()
], BaseModel);
exports.BaseModel = BaseModel;
