var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Professional } from './Professional.js';
import { Patient } from './Patient.js';
let Consultation = class Consultation {
    constructor() {
        this.createdAt = new Date();
    }
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Consultation.prototype, "id", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Consultation.prototype, "audioPath", void 0);
__decorate([
    Property({ onCreate: () => new Date() }),
    __metadata("design:type", Object)
], Consultation.prototype, "createdAt", void 0);
__decorate([
    ManyToOne(() => Professional, { inversedBy: 'consultations' }),
    __metadata("design:type", Professional)
], Consultation.prototype, "professional", void 0);
__decorate([
    ManyToOne(() => Patient, { inversedBy: 'consultations' }),
    __metadata("design:type", Patient)
], Consultation.prototype, "patient", void 0);
Consultation = __decorate([
    Entity({ tableName: 'consultations' })
], Consultation);
export { Consultation };
