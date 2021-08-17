import * as fs from "fs";
import fetch from "node-fetch";

export async function generateAvatar(dest:string) {
	const response = await fetch("https://thispersondoesnotexist.com/image");
	const buffer = await response.buffer();
	console.log("write to ", dest);
	fs.writeFile(dest, buffer, () => 
	  console.log('finished downloading avatar!'));
}