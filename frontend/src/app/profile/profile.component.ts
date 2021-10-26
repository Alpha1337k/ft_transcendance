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
/*   *.   profile.component.ts     | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Match, User } from '../modules/interfaces';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	private routeSub: Subscription | undefined;
	private profileId: number = 0;
	user: User | undefined;

	constructor(private route: ActivatedRoute, private http: HttpClient, private sanitizer: DomSanitizer)
	{

	}
	
	async ngOnInit(): Promise<void>
	{
		this.routeSub = this.route.params.subscribe(params => {
			console.log(params) //log the entire params object
			console.log(params['id']) //log the value of id
			this.profileId = params['id'] as number;
			console.log(this.profileId);
			this.setContent();
		  });
	}
  addUser()
  {
	  console.log("aahahhahaha");
  }

  createHistoryDoms(matches: Match[]): string {
		let rval = '';
		if (matches == null || matches.length == 0)
			return '<h3>Nothing to display</h3>';
		for (let index = 0; index < matches.length; index++) {
			const m = matches[index];
			rval += `
			<div class="past-match">
				<a routerLink="/profile/1">${"User1"}</a>
				<p> | </p>
				<a routerLink="/profile/2">${"User2"}</a>
				<h5>${m.p1Score} - ${m.p2Score}</h5>
			</div>`;
		}
		return rval;
	}


  async setContent(): Promise<void> {
	  console.log('adding user or smth');
	let usr: User = await this.http.get<User>(`http://localhost:5000/profile/${this.profileId}`).toPromise();
	console.log(usr);
	this.user = usr;
  }

  ngOnDestroy(): void {
	this.routeSub?.unsubscribe();
  }

}
