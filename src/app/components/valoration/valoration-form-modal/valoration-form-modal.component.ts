import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Valoration } from '../../../models/valoration.model';

@Component({
  selector: 'app-valoration-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './valoration-form-modal.component.html',
  styleUrl: './valoration-form-modal.component.css'
})
export class ValorationFormModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() ratedUserId!: string;
  @Input() groupId!: string;
  @Input() valoration: Valoration | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() submitValoration = new EventEmitter<Valoration>();

  rating: number = 0;
  valorationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.valorationForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.valoration) {
      this.prefillForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['valoration'] && this.valoration) {
      this.prefillForm();
    }
  }

  private prefillForm() {
    this.valorationForm.setValue({
      title: this.valoration!.title,
      description: this.valoration!.description
    });
    this.rating = this.valoration!.rating;
  }

  setRating(value: number) {
    this.rating = value;
  }

  submit() {
    if (this.valorationForm.valid) {
      const { title, description } = this.valorationForm.value;
      let newValoration;

      if(this.valoration){
        this.valoration.description = description;
        this.valoration.title = title;
        this.valoration.rating = this.rating;
        newValoration = this.valoration;
      }else{
        this.valoration = new Valoration("-1",title,description,this.rating,this.ratedUserId,"-1");
      }

      this.submitValoration.emit(newValoration);
      this.close.emit();
      this.resetForm();
    }
  }

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  private resetForm() {
    this.valorationForm.reset();
    this.rating = 0;
  }
}
