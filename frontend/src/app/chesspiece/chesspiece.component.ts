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
/*   *.   chesspiece.component.ts  | Created: 2021-10-26 22:33:59    ._    */
/*  -     Edited on 2021-10-26 22:33:59 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chesspiece',
  templateUrl: './chesspiece.component.html',
  styleUrls: ['./chesspiece.component.css']
})
export class ChesspieceComponent implements OnInit {
	id: string = '';
	color: string = 'w';
	pieceImg: string = '';
	leftPos:string = '';
	topPos:string = '';
	classes:string = '';

  constructor() { }

  ngOnInit(): void {
  
	}

	init(id: string, color: string, left: string, top: string, img: string, selectable: boolean)
	{
		this.id = id;
		this.color = color;
		this.pieceImg = img;
		this.leftPos = left;
		this.topPos = top;
		this.classes = color + ' ' + selectable ? '' : 'unselectable';
	}

}
