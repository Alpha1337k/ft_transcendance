import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { ImageModule } from 'src/image/image.module';

@Module({
	imports: [UserModule, ImageModule],
	controllers: [SettingsController],
	providers: [SettingsService],
})
export class SettingsModule {}
