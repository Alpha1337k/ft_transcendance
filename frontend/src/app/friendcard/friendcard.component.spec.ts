import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendcardComponent } from './friendcard.component';

describe('FriendcardComponent', () => {
  let component: FriendcardComponent;
  let fixture: ComponentFixture<FriendcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendcardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
