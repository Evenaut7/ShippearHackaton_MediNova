var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Consultation } from './Consultation.js';
let Patient = class Patient {
    constructor() {
        this.createdAt = new Date();
        this.consultations = new Collection(this);
    }
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Patient.prototype, "id", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Patient.prototype, "name", void 0);
__decorate([
    Property({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Patient.prototype, "email", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Date)
], Patient.prototype, "birthDate", void 0);
__decorate([
    Property({ onCreate: () => new Date() }),
    __metadata("design:type", Object)
], Patient.prototype, "createdAt", void 0);
__decorate([
    OneToMany(() => Consultation, consultation => consultation.patient),
    __metadata("design:type", Object)
], Patient.prototype, "consultations", void 0);
Patient = __decorate([
    Entity({ tableName: 'patients' })
], Patient);
export { Patient };
