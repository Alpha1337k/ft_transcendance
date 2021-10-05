export interface Match {
	matchid: number;
	players: User[];
	p1Score: number;
	p2Score: number;
}

export enum UserRank {
	SPLUS = 'S+',
	S = 'S',
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
}

export interface User {
	userid:		string;
	name:		string;
	wins:		number;
	losses: 	number;
	lastSeen:	Date;
	history:	Match[];
	userElo:	number;
	UserRank:	UserRank;
	imageUrl:	string;
}