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
/*   *.   2fa.ts                   | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import * as readline from 'readline';

const secrets = [];

export function getTwoFactorAuthenticationCode() {
	const secretCode = speakeasy.generateSecret({ name: 'Pong online' });
	return {
		otpauthUrl: secretCode.otpauth_url,
		base32: secretCode.base32,
	};
}

function createQrCodeAsImg(url: string) {
	qrcode.toFile('img.png', url, function (err) {
		console.log('error', err);
	});
}

export async function createQrCodeAsURL(data: string): Promise<string> {
	return await qrcode.toDataURL(data);
}

export function check2faInput(input: string, secret: string) {
	const check = speakeasy.totp.verify({
		secret: secret,
		encoding: 'base32',
		token: input,
	});
	console.log('check returns', check);
	return check;
}

function UserInput(query: string) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) =>
		rl.question(query, (ans) => {
			rl.close();
			resolve(ans);
		})
	);
}

async function runexample() {
	const data = getTwoFactorAuthenticationCode();
	console.log(data);
	secrets.push(data.base32);
	createQrCodeAsImg(data.otpauthUrl);
	while (1) {
		check2faInput(
			(await UserInput('give me the input fam: ')) as string,
			data.base32
		);
	}
}
