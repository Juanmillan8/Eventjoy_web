import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportReason } from '../../../models/report.model';
import { Group } from '../../../models/group.model';
import { Invitation } from '../../../models/invitation.model';
import { Member } from '../../../models/member.model';
import { MemberService } from '../../../services/member.service';
import { InvitationService } from '../../../services/invitation.service';

@Component({
  selector: 'app-invitation-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './invitation-form-modal.component.html',
  styleUrl: './invitation-form-modal.component.css'
})
export class InvitationFormModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() authMember: Member | null = null;

  @Input() groupInput: Group | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() submitValoration = new EventEmitter<Invitation>();
  members: Member[] | null = null;
  filterTermMembers: string = '';
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'success';
  toastTimeout: any = null;


  constructor(private fb: FormBuilder, private memberService: MemberService, private invitationService: InvitationService) { }

  ngOnInit(): void {
    if (this.groupInput) {
      this.prefillForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show) {
      this.prefillForm();
    }
  }

  private prefillForm() {

    if (this.groupInput) {
      this.memberService.getMembersNotInGroup(this.groupInput.id).subscribe((notInMembers) => (this.members = notInMembers));
    }

  }

  get filteredMembers(): Member[] {
    const term = this.filterTermMembers.trim().toLowerCase();
    if (!this.members) {
      return [];
    }

    return this.members.filter(m => {
      // concatenamos los campos que queremos buscar
      const haystack = [
        m.name,
        m.surname,
        m.username
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }


  closeModal() {
    this.close.emit();
  }

  onInvite(user: Member) {
    if (this.groupInput && this.authMember) {
      this.invitationService.existInvitationByUserAndGroupId(user.userAccountId, this.groupInput.id).then((exist: boolean) => {
        if (!exist && this.authMember && this.groupInput) {
          let newInvitation = new Invitation("-1", user.userAccountId, this.authMember.userAccountId, this.groupInput?.id, new Date().toLocaleDateString())
          this.invitationService.save(newInvitation).then(() => {
            this.showToast("Invitation sent successfully", "success");
          }).catch(() => {
            this.showToast("Error sending invitation", "danger");
          })
        } else {
            this.showToast("The user already has a pending invitation.", "warning");
        }
      });
    }
    this.prefillForm()
  }
  showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info', duration: number = 3000): void {
    this.toastMessage = message;
    this.toastType = type;

    // Limpiar timeout anterior si existe
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    // Autocierre tras x milisegundos
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = null;
    }, duration);
  }

  closeToast(): void {
    this.toastMessage = null;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

}
