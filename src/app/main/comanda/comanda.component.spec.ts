import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComandaComponent } from './comanda.component';

describe('ComandaComponent', () => {
  let component: ComandaComponent;
  let fixture: ComponentFixture<ComandaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
