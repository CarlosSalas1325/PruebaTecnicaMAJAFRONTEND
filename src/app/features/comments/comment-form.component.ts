import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: "app-comment-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./comment-form.component.html",
  styleUrl: "./comment-form.component.css"
})
export class CommentFormComponent {
  @Input() label = "Nuevo comentario";
  @Output() save = new EventEmitter<string>();

  form = this.fb.group({
    content: ["", [Validators.required, Validators.minLength(2)]]
  });

  constructor(private readonly fb: FormBuilder) {}

  submit(): void {
    if (this.form.invalid) return;
    this.save.emit(this.form.getRawValue().content ?? "");
    this.form.reset();
  }
}
