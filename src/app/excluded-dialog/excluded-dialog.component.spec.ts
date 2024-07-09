import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcludedDialogComponent } from './excluded-dialog.component';

describe('ExcludedDialogComponent', () => {
  let component: ExcludedDialogComponent;
  let fixture: ComponentFixture<ExcludedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcludedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcludedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
