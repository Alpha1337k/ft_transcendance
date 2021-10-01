import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	private routeSub: Subscription | undefined;
	private profileId: number = 0;
	profileHTML: string = '';
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
	this.routeSub = this.route.params.subscribe(params => {
		console.log(params) //log the entire params object
		console.log(params['id']) //log the value of id
		this.profileId = params['id'] as number;
		console.log(this.profileId);
		this.loadContent();
	  });
  }

  async loadContent(): Promise<void> {
	let page = await this.http.get(`http://localhost:5000/profile/${this.profileId}`, { responseType: 'text'}).toPromise();
	this.profileHTML = page;
  }

  ngOnDestroy(): void {
	this.routeSub?.unsubscribe();
  }

}
