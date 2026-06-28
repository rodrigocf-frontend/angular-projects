import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardTable } from './board-table';

describe('BoardTable', () => {
  let component: BoardTable;
  let fixture: ComponentFixture<BoardTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardTable],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
