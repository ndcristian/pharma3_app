import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutompleteComponent } from './autocomplete.component';

describe('AutompleteComponent', () => {
  let component: AutompleteComponent;
  let fixture: ComponentFixture<AutompleteComponent>;

  beforeEach(async(() => {
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
