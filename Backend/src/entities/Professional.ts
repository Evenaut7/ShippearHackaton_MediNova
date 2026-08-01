import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Consultation } from './Consultation.js';

@Entity({ tableName: 'professionals' })
export class Professional {
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property({ nullable: true, unique: true })
    email?: string;

    @Property({ nullable: true })
    phone?: string;

    @Property({ nullable: true })
    specialization?: string;

    @Property({ onCreate: () => new Date() })
    createdAt = new Date();

    @OneToMany(() => Consultation, consultation => consultation.professional)
    consultations = new Collection<Consultation>(this);
}
