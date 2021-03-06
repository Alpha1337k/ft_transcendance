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
/*   *.   app.module.ts            | Created: 2021-10-26 22:33:59    ._    */
/*  -     Edited on 2021-10-26 22:33:59 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FriendsComponent } from './friends/friends.component';
import { HomescreenComponent } from './homescreen/homescreen.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { FriendcardComponent } from './friendcard/friendcard.component';
import { QueuescreenComponent } from './queuescreen/queuescreen.component';
import { PongComponent } from './pong/pong.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChessComponent } from './chess/chess.component';
import { ChesspieceComponent } from './chesspiece/chesspiece.component';
import { ChatComponent } from './chat/chat.component';


const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };
const routes: Routes = [
  { path: 'settings', component: SettingsComponent, pathMatch: "prefix"},
  { path: 'profile/:id', component: ProfileComponent,  pathMatch: "prefix"},
  { path: 'play/pong/:id/:usr', component: PongComponent,  pathMatch: "prefix"},
  { path: 'play/chess/:id/:usr', component: ChessComponent,  pathMatch: "prefix"},
  { path: '', component: HomescreenComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    FriendsComponent,
    SettingsComponent,
    HomescreenComponent,
    ProfileComponent,
    FriendcardComponent,
    QueuescreenComponent,
    PongComponent,
    ChessComponent,
    ChesspieceComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	SocketIoModule.forRoot(config),
	RouterModule.forRoot(routes),
	HttpClientModule,
  ReactiveFormsModule,
  FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
