import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
	imports: [UserModule],
	controllers: [SettingsController],
	providers: [SettingsService],
})
export class SettingsModule {}
