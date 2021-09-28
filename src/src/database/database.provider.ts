import { createConnection } from 'typeorm';

export const databaseProvider = [
	{
		provide: 'DATABASE_CONNECTION',
		useFactory: async () =>
			await createConnection({
				type: 'postgres',
				host: 'localhost',
				port: 5432,
				username: 'postgres',
				password: 'codam',
				database: 'test',
				entities: [__dirname + '/../**/*.entity{.ts,.js}'],
				synchronize: true,
			}),
	},
];
