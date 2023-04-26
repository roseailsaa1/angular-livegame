import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastCommentMobileComponent } from './last-comment-mobile.component';

describe('LastCommentMobileComponent', () => {
  let component: LastCommentMobileComponent;
  let fixture: ComponentFixture<LastCommentMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastCommentMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastCommentMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
