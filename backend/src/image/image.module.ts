import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ImageService } from './image.service';
import { ImageProvider } from './image.provider';
import { UserModule } from 'src/user/user.module';
import { ImageController } from './image.controller';

@Module({
	imports: [DatabaseModule],
	controllers: [ImageController],
	providers: [ImageService, ...ImageProvider],
	exports: [ImageService, ...ImageProvider],
})
export class ImageModule {}
