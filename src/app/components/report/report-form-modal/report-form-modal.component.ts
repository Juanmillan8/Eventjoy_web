import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Report, ReportReason } from '../../../models/report.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './report-form-modal.component.html',
  styleUrl: './report-form-modal.component.css'
})
export class ReportFormModalComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() reportInput: Report | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() submitValoration = new EventEmitter<Report>();

  reportReasons = Object.values(ReportReason);

  rating: number = 0;
  reportForm: FormGroup;
  errores:string|null=null;

  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      description: ['', Validators.required],
      reason:['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.reportInput) {
      this.prefillForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['report'] && this.reportInput) {
      this.prefillForm();
    }
  }

  private prefillForm() {
    this.reportForm.setValue({
      reason: this.reportInput!.reportReason,
      description: this.reportInput!.reportDescription
    });
  }

  setRating(value: number) {
    this.rating = value;
  }

  submit() {
    this.errores=null;
    if (this.reportForm.valid) {
      const { reason, description } = this.reportForm.value;
      if (this.reportInput) {
        this.reportInput.reportDescription = description;
        this.reportInput.reportReason = reason;
        this.submitValoration.emit(this.reportInput);
        this.close.emit();
        this.resetForm();
      }
    }else{

      this.errores = "The form has errors."
            console.log(this.errores)
    }
  }

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  private resetForm() {
    this.reportForm.reset();
    this.rating = 0;
  }
}
