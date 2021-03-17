import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AutompleteComponent } from './autocomplete.component';

describe('AutompleteComponent', () => {
  let component: AutompleteComponent;
  let fixture: ComponentFixture<AutompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AutompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
