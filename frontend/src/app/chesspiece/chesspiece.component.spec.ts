import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChesspieceComponent } from './chesspiece.component';

describe('ChesspieceComponent', () => {
  let component: ChesspieceComponent;
  let fixture: ComponentFixture<ChesspieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChesspieceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChesspieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
