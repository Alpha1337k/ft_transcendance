import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SettingsService } from "./settings.service";

@Controller("settings")
export class SettingsController {
	constructor(private readonly settingsService : SettingsService) {}

	@Get()
	async returnSettings() {
		return await this.settingsService.getSettings();
	}

	@Get("getQr")
	async return2fa() {
		return await this.settingsService.create2fadiv();
	}

	@Post("update")
	@UseInterceptors(FileInterceptor('file'))
	async getNewPF(@UploadedFile() file: Express.Multer.File, @Body() form) {
		console.log(form, form.username);
		
		this.settingsService.updateName(form.username);
		if (file != null && file != undefined)
			this.settingsService.updatePicture(file.buffer.toString('base64'));
		return ("OK");
	}
}