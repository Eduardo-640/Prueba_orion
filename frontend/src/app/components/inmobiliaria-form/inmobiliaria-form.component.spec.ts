import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmobiliariaFormComponent } from './inmobiliaria-form.component';

describe('InmobiliariaFormComponent', () => {
  let component: InmobiliariaFormComponent;
  let fixture: ComponentFixture<InmobiliariaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InmobiliariaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InmobiliariaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
