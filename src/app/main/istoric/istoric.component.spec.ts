import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IstoricComponent } from './istoric.component';

describe('IstoricComponent', () => {
  let component: IstoricComponent;
  let fixture: ComponentFixture<IstoricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IstoricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IstoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
