import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FriendsComponent } from './friends/friends.component';
import { HomescreenComponent } from './homescreen/homescreen.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from '@angular/common/http';


const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    FriendsComponent,
    SettingsComponent,
    HomescreenComponent,
	ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	SocketIoModule.forRoot(config),
	RouterModule.forRoot([
		{path: 'settings/', component: SettingsComponent},
		{path: 'profile/:id', component: ProfileComponent,  pathMatch: "prefix"},
		{path: '', component: HomescreenComponent}
	]),
	HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
