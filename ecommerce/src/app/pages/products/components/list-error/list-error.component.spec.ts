import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListErrorComponent } from './list-error.component';

describe('ListErrorComponent', () => {
  let component: ListErrorComponent;
  let fixture: ComponentFixture<ListErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListErrorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
