import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Consultation } from './Consultation.js';

@Entity({ tableName: 'patients' })
export class Patient {
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property({ nullable: true, unique: true })
    email?: string;

    @Property({ nullable: true })
    birthDate?: Date;

    @Property({ onCreate: () => new Date() })
    createdAt = new Date();

    @OneToMany(() => Consultation, consultation => consultation.patient)
    consultations = new Collection<Consultation>(this);
}
