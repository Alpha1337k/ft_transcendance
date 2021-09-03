import { Controller, Get } from "@nestjs/common";
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
}