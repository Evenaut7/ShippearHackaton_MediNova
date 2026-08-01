import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Professional } from './Professional.js';
import { Patient } from './Patient.js';

@Entity({ tableName: 'consultations' })
export class Consultation {
    @PrimaryKey()
    id!: number;

    @Property()
    audioPath!: string;

    @Property({ onCreate: () => new Date() })
    createdAt = new Date();

    @ManyToOne(() => Professional, { inversedBy: 'consultations' })
    professional!: Professional;

    @ManyToOne(() => Patient, { inversedBy: 'consultations' })
    patient!: Patient;
}
