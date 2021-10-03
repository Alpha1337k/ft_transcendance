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
