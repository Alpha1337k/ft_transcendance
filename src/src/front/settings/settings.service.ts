import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import * as twofa from "src/modules/2fa/2fa"

@Injectable()
export class SettingsService {
	constructor(private readonly userService : UserService) {
		
	}

	async create2fadiv() {
		let user : UserEntity = await this.userService.getUserById(1);

		let codedata = twofa.getTwoFactorAuthenticationCode();
		user.twoFactorSecret = codedata.base32;
		let qrcode = await twofa.createQrCodeAsURL(codedata.otpauthUrl);


		this.userService.updateUser(user);
		return `
				<img src="${qrcode}">
				<p>We will only show this once! so be sure to save it or you're fucked</p>
				`
	}

	async getSettings() {
		let user : UserEntity = await this.userService.getUserById(1);

		let is2faenabled : string = user.twoFactorSecret == null ? "" : "checked='true'"
		return	`
				<div id="profilescreen">
					<div class="box-announcement">
						<h1>Settings</h1>
					</div>
				
					<h5>Profile picture</h5>
					<p>.png only</p>

					<input id="fileupload" name="file" type="file" />
					<button onclick="submitpf()">Send</button>   
				
					<h5>2fa</h5>
					<input type="checkbox" name="2facheck" onchange="LoadMainContent('/settings/getQr', '#2fadiv', 'settings', false)" ${is2faenabled}>
					<label for="2facheck">Enable</label>
					<div id="2fadiv"></div>
				
					<button class="red">Delete account</h5>
				</div>
		
				<script>
					function submitpf()
					{
						var f = new FormData();
						f.append('file', $('#fileupload')[0].files[0]);
						$.ajax({
							url: '/settings/updatepf',
							type: 'post',
							data: f,
							processData: false,
							contentType: false,
							success:function(){
								console.log("sucessful upload!");
							},
							error: function() {
								console.log("whoops");
							}
						});
						location.reload();
					}
				</script>
				`
	}

	async updatePicture(image : string)
	{
		const user : UserEntity = await this.userService.getUserById(1);

		user.image = image;

		this.userService.updateUser(user);
	}
}