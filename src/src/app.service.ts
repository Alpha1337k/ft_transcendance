import { Injectable } from '@nestjs/common';
import { UserEntity } from './user/user.entity';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
	constructor (private readonly userService : UserService) {}

	getMain() {
		return `
		<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Play Pong online</title>
				<link rel="stylesheet" href="main.css">
				<link rel="preconnect" href="https://fonts.googleapis.com">
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
				<link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
				<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
				<script src="main.js"></script>
			</head>
			<body>
				<div class="loginscreen">
					<h2>Welcome back!</h2>
					<h5>Login</h5>
					<input type="text" placeholder="Username" name="username">
					<br>
					<h5>Password</h5>
					<input type="password" placeholder="****" name="password">
					<input type="submit" value="Login" onclick="loginUser()">
					<input type="submit" value="Create account" onclick="alert('xd')">
				</div>
			</body>
			</html>`;
	}

	async getStructure() {

		let user : UserEntity = await this.userService.getUserById(1);
		if (user == undefined)
			return 'user is not logged in properly!!!';
		return `
			<div class="navbar">
				<h1>Play Pong</h1>
				<div class="current-user-display">
					<div class="current-user-content">
						<div>
						<hr>
						<a onclick="LoadMainContent('profile/${user.userid}', '#main-box', 'profile')">Profile</a><br>
						<a onclick="LoadMainContent('settings', '#main-box', 'settings')">Settings</a><br>
						<a>Logout</a>
						</div>
					</div>
					<div style="display: flex;">
					<img src="data:image/png;base64, ${user.image}">
					<h3>${user.name}</h3>
					</div>
				</div>
			</div>
			<div class="main-content">
				<div class="friendbar" id="friends-tab">
					<div class="box-announcement">
						<h3>Friends</h3>
					</div>
				</div>
				<div class="main-box" id="main-box">
				</div>

				<div class="spectator-box">
					<div class="box-announcement">
						<h3>Other games</h3>
					</div>
					<br>
					<br>
					<p>There are currently no other games</p>
				</div>
			</div>

			<div id="openchat-overlay"></div>
			
	`;
	}
}
