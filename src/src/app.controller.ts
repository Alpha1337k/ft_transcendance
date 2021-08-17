import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("friends")
  test(): string {
	  return this.appService.getFriends();
  }
  @Get("profile")
  profile(@Query() query): string {
	/*
		currently using query (?) as parameter, might need to change later
	*/
	return (this.appService.getProfile(query.id));
  }
}
