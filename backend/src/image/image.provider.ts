import { Connection } from 'typeorm';
import { ImageEntity } from './image.entity';

export const ImageProvider = [
	{
		provide: 'IMAGE_REPOSITORY',
		useFactory: (connection: Connection) =>
			connection.getRepository(ImageEntity),
		inject: ['DATABASE_CONNECTION'],
	},
];
