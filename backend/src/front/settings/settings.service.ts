import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as twofa from 'src/modules/2fa/2fa';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class SettingsService {
	constructor(private readonly userService: UserService, private imageService: ImageService) {}

	async create2fadiv() {
		const user: UserEntity = await this.userService.getUserById(1);

		const codedata = twofa.getTwoFactorAuthenticationCode();
		user.twoFactorSecret = codedata.base32;
		const qrcode = await twofa.createQrCodeAsURL(codedata.otpauthUrl);

		await this.userService.updateUser(user);
		return `
				<img src="${qrcode}">
				<p>We will only show this once! so be sure to save it or you're fucked</p>
				`;
	}

	async updatePicture(image: string) {
		const user: UserEntity = await this.userService.getUserById(1);
		user.imageUrl = await this.imageService.addImg(image);
		await this.userService.updateUser(user);
	}

	async updateName(newName: string) {
		const users: UserEntity[] = await this.userService.getAllUsers();
		const user: UserEntity = await this.userService.getUserById(1);

		if (users.find((u) => u.name == newName && u.userid != 1) == undefined) {
			user.name = newName;
			await this.userService.updateUser(user);
		}
	}
}
