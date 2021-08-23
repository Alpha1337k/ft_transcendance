import { UserEntity } from "src/user/user.entity";

// create an last seen display of layout 'number scale ago' OR online
export function createLastSeen(user : UserEntity): string {
		let lastSeenText : string;

		if (user.lastSeen.getTime() == new Date(0).getTime())
			lastSeenText = "Online";
		else
		{
			let size : string;
			// get difference in time in minutes
			let diff : number = (new Date().getTime() - user.lastSeen.getTime()) / 1000 / 60;

			// scale accordingly
			if (diff >= 60 && diff < 1440)
			{
				diff /= 60;
				size = ' hours';
			}
			else if (diff >= 1440)
			{
				diff /= 1440;
				size = ' days';					
			}
			else
				size = ' minutes';
			lastSeenText = Math.round(diff) + size + " ago";
		}
		return lastSeenText;
}