import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ValorationService, ValorationWithUsername } from '../../../services/valoration.service';
import { Valoration } from '../../../models/valoration.model';
import { AuthService } from '../../../services/auth.service';
import { Member } from '../../../models/member.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ValorationFormModalComponent } from '../valoration-form-modal/valoration-form-modal.component';

@Component({
  selector: 'app-valoration-list',
  standalone: true,
  imports: [CommonModule, RouterLink,ValorationFormModalComponent],
  templateUrl: './valoration-list.component.html',
  styleUrl: './valoration-list.component.css'
})
export class ValorationListComponent implements OnInit, OnChanges {

  @Input() userId: string | null = null;
  @Input() view: string | null = null;
  valorations: { valoration: Valoration; rater: Member }[] | null = null;

  authMember: Member | null = null;
  ratedList: { valoration: Valoration; rater: Member }[] | null = null;
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'success';
  toastTimeout: any = null;

  selectedUserId: string | null = null;
  showValorationModal = false;
  selectedValoration:Valoration | null = null;

  constructor(private valorationService: ValorationService, private authService: AuthService) { }

  ngOnInit(): void {

    this.authService.getUserDataAuth().subscribe(({ user, member }) => {
      this.authMember = member;
    })

    if (this.userId && this.view) {
      this.loadList();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // si cambia userId **o** view, recargamos
    if ((changes['userId'] || changes['view']) && this.userId && this.view) {
      this.loadList();
    }
  }

  private loadList() {

    if (this.userId && this.view) {
      if (this.view === 'MADED') {
        this.valorationService
          .getMadeValorationsWithRaters(this.userId)
          .subscribe(list => (this.ratedList = list));
      } else if (this.view === 'RECEIVED') {
        this.valorationService
          .getReceivedValorationsWithRaters(this.userId)
          .subscribe(list => (this.ratedList = list));
      }
    }
  }

  editValoration(valoration:Valoration){}
  deleteValoration(valoration:Valoration){
    this.valorationService.delete(valoration.id).then(()=>{
        this.showToast("Rating successfully deleted.","success");
    }).catch(()=>{
        this.showToast("Error deleting valoration.","danger");

    });
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

 openValorationModal(valoration:Valoration) {
    this.selectedUserId = valoration.ratedUserId;
    this.selectedValoration=valoration;
    if (this.authMember && this.selectedUserId) {
      this.valorationService.hasBeenUserRated(this.authMember.id, this.selectedUserId).then((res: boolean) => {
        if (res) {
          this.showValorationModal = true;
        }
      })
    }
  }

  onSubmitValoration(data: Valoration ) {
    if (this.selectedUserId && this.authMember) {
      data.raterUserId = this.authMember.id;
      let isEditing=data.id=="-1"?false:true;

      this.valorationService.save(data).then(() => {
        if(isEditing){
        this.showToast("Valuation updated successfully.", "success")
        }else{
        this.showToast("Valuation created successfully.", "success")
        }
      }).catch(() => {
        this.showToast("Error creating the valuation.", "danger")
      })
    }
  }

  closeValorationModal() {
    this.selectedValoration=null;
    this.showValorationModal = false;
  }
}
