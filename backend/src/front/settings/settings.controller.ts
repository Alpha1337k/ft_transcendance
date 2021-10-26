/*  * -*  *- *- *- *- *- *- * * ** -* -* -* - *- *- *-* - ** - *- - * *-   */
/*  *       _                                 _                        +\  */
/*   -     | |_ ___ ___ ___ ___ ___ ___ ___ _| |___ ___ ___ ___       +    */
/*   +     |  _|  _| .'|   |_ -|  _| -_|   | . | -_|   |  _| -_|       /*  */
/*  *      |_| |_| |__,|_|_|___|___|___|_|_|___|___|_|_|___|___|         + */
/*  -       ~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~        *  */
/*  *       Oscar Kruithof   |   okruitho    |   Alpha_1337k           *-  */
/*  -*      Robijn van Houts |   rvan-hou    |   robijnvh             -+   */
/*  * /   Jonas Bennink Bolt |   jbennink    |   JonasDBB            /-    */
/*  /       Tim van Citters  |   tvan-cit    |   Tjobo-Hero           *    */
/*   +      Rene Braaksma    |   rbraaksm    |   rbraaksm              -   */
/*    *.                                                              ._   */
/*   *.   settings.controller.ts   | Created: 2021-10-20 16:26:03    ._    */
/*  -     Edited on 2021-10-20 16:26:03 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingsService } from './settings.service';

interface formdata {
	name: string;
	s2fa: string;
	profilePrivacy: string;
	chatPrivacy: string;
	deleteBlocked: string;
}

@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Get('getQr')
	async return2fa() {
		return await this.settingsService.create2fadiv();
	}

	@Post('update')
	@UseInterceptors(FileInterceptor('file'))
	async getNewPF(@UploadedFile() file: Express.Multer.File, @Body() form : formdata) {
		console.log(form, file !== null);

		await this.settingsService.updateName(form.name);
		if (file !== null && file.buffer !== undefined)
			await this.settingsService.updatePicture(file.buffer.toString('base64'));
		return 'OK';
	}
}
