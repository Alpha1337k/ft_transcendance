import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
    //imports: [
	//	ServeStaticModule.forRoot({
	//	  rootPath: __dirname +  '../../site_static/'
	//	})],
	imports: [],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
