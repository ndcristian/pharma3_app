import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NecesarComponent } from './necesar.component';

describe('NecesarComponent', () => {
  let component: NecesarComponent;
  let fixture: ComponentFixture<NecesarComponent>;

  beforeEach(async(() => {
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
