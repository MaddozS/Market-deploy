import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPublicacionComponent } from './vista-publicacion.component';

describe('VistaPublicacionComponent', () => {
  let component: VistaPublicacionComponent;
  let fixture: ComponentFixture<VistaPublicacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaPublicacionComponent]
    });
    fixture = TestBed.createComponent(VistaPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
