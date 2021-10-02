import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuescreenComponent } from './queuescreen.component';

describe('QueuescreenComponent', () => {
  let component: QueuescreenComponent;
  let fixture: ComponentFixture<QueuescreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueuescreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
