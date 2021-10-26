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
/*   *.   lastseen.ts              | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
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