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
/*   *.   settings.component.ts    | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	nameValue: string = 'Jeff';
	is2faChecked: boolean = false;
	profile_level: number = 1;
	chat_level: number = 1;
	fileToUpload: File | null = null;
	blockDelete: boolean = false;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) { }

  ngOnInit(): void {
	  console.log("init?");
  }

	handleFileInput(evnt: Event) {
		console.log("ahahahah");
		const elem = evnt.currentTarget as HTMLInputElement;

		if (elem.files !== null)
			this.fileToUpload = elem.files.item(0);
	}

  submit() {
	let formData = new FormData();

	if (this.fileToUpload !== null)
		formData.append('file', this.fileToUpload);
	formData.append('name', this.nameValue);
	formData.append('s2fa', this.is2faChecked.toString());
	formData.append('profilePrivacy', this.profile_level.toString());
	formData.append('chatPrivacy', this.chat_level.toString());
	formData.append('deleteBlocked', this.blockDelete.toString());
	formData.forEach((value, key) => {
		console.log(value, key);
	});
	this.httpClient.post<any>("http://localhost:5000/settings/update", formData).subscribe((obs) => {
		console.log(obs);
	});
  }

}
