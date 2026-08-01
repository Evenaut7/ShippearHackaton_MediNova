import { EntitySchema } from '@mikro-orm/core';
export const User = new EntitySchema({
    name: 'User',
    tableName: 'users',
    properties: {
        id: { type: 'number', primary: true },
        name: { type: 'string' },
        email: { type: 'string' },
        createdAt: { type: 'Date', onCreate: () => new Date() },
    },
});
