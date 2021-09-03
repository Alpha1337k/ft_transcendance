import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import * as readline from 'readline'

var secrets = [];

export function getTwoFactorAuthenticationCode() {
	const secretCode = speakeasy.generateSecret({name: "Pong online"});
	return {
		otpauthUrl : secretCode.otpauth_url,
		base32: secretCode.base32,
	};
}

function createQrCodeAsImg(url:string) {
	qrcode.toFile("img.png", url, function (err) {
		console.log("error", err);
	})
}

export async function createQrCodeAsURL(data : string) : Promise<string> {
	return await qrcode.toDataURL(data);
}

export function check2faInput(input: string, secret : string)
{
	var check = speakeasy.totp.verify({secret : secret, encoding: "base32", token : input});
	console.log("check returns", check);
	return (check);
}

function UserInput(query: string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

async function runexample() {
	const data = getTwoFactorAuthenticationCode();
	console.log(data);
	secrets.push(data.base32);
	createQrCodeAsImg(data.otpauthUrl);
	while (1) {
		check2faInput(await UserInput("give me the input fam: ") as string, data.base32);
	}
}
