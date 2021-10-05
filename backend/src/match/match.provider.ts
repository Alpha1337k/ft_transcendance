import { Connection } from 'typeorm';
import { Match } from './match.entity';

export const MatchProvider = [
	{
		provide: 'MATCH_REPOSITORY',
		useFactory: (connection: Connection) =>
			connection.getRepository(Match),
		inject: ['DATABASE_CONNECTION'],
	},
];
