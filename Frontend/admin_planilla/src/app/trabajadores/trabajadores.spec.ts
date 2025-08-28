import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoTrabaadoresComponent } from './trabajadores';

describe('Trabajadores', () => {
  let component: ListadoTrabaadoresComponent;
  let fixture: ComponentFixture<ListadoTrabaadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoTrabaadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoTrabaadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
