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
/*   *.   settings.service.ts      | Created: 2021-10-20 16:26:03    ._    */
/*  -     Edited on 2021-10-20 16:26:03 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
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
