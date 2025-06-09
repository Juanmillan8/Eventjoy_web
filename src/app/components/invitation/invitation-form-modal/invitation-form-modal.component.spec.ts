import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationFormModalComponent } from './invitation-form-modal.component';

describe('InvitationFormModalComponent', () => {
  let component: InvitationFormModalComponent;
  let fixture: ComponentFixture<InvitationFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
