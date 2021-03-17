import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NecesarComponent } from './necesar.component';

describe('NecesarComponent', () => {
  let component: NecesarComponent;
  let fixture: ComponentFixture<NecesarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NecesarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NecesarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
