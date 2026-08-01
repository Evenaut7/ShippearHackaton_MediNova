var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Consultation } from './Consultation.js';
let Professional = class Professional {
    constructor() {
        this.createdAt = new Date();
        this.consultations = new Collection(this);
    }
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Professional.prototype, "id", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Professional.prototype, "name", void 0);
__decorate([
    Property({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Professional.prototype, "email", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Professional.prototype, "phone", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Professional.prototype, "specialization", void 0);
__decorate([
    Property({ onCreate: () => new Date() }),
    __metadata("design:type", Object)
], Professional.prototype, "createdAt", void 0);
__decorate([
    OneToMany(() => Consultation, consultation => consultation.professional),
    __metadata("design:type", Object)
], Professional.prototype, "consultations", void 0);
Professional = __decorate([
    Entity({ tableName: 'professionals' })
], Professional);
export { Professional };
