import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as twofa from 'src/modules/2fa/2fa';

@Injectable()
export class SettingsService {
	constructor(private readonly userService: UserService) {}

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

	async getSettings() {
		const user: UserEntity = await this.userService.getUserById(1);

		const is2faenabled: string =
			user.twoFactorSecret == null ? '' : "checked='true'";
		return ` 
				<div id="profilescreen">
					<div class="box-announcement">
						<h1>Settings</h1>
					</div>

					<h5>Username</h5>
					<input type="text" id="username" value="${user.name}">

					<h5>Profile picture</h5>
					<p>.png only</p>

					<input id="fileupload" name="file" type="file" />
				
					<h5>2fa</h5>
					<input type="checkbox" name="2facheck" onchange="LoadMainContent('/settings/getQr', '#2fadiv', 'settings', false)" ${is2faenabled}>
					<label for="2facheck">Enable</label>
					<div id="2fadiv"></div>
				
					<button class="red">Delete account</button>
					<button onclick="submit()">Save</button>

				</div>
		
				<script>
					function submit()
					{
						var f = new FormData();
						f.append('file', $('#fileupload')[0].files[0]);
						f.append('username', document.getElementById("username").value)
						$.ajax({
							url: '/settings/update',
							type: 'post',
							data: f,
							processData: false,
							contentType: false,
							success:function(){
								console.log("sucessful upload!");
								location.reload();
							},
							error: function() {
								console.log("whoops");
							}
						});
					}
				</script>
				`;
	}

	async updatePicture(image: string) {
		const user: UserEntity = await this.userService.getUserById(1);

		user.image = image;

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
