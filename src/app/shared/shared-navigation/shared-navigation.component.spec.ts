import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedNavigationComponent } from './shared-navigation.component';

describe('SharedNavigationComponent', () => {
  let component: SharedNavigationComponent;
  let fixture: ComponentFixture<SharedNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
