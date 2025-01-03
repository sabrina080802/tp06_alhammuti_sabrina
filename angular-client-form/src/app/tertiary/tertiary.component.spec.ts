import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TertiaryComponent } from './tertiary.component';

describe('TertiaryComponent', () => {
  let component: TertiaryComponent;
  let fixture: ComponentFixture<TertiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TertiaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TertiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
