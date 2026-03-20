import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CategoriesService, CategoryItem } from "../../core/services/categories.service";

@Component({
  selector: "app-categories-admin",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./categories-admin.component.html",
  styleUrl: "./categories-admin.component.css"
})
export class CategoriesAdminComponent implements OnInit {
  categories: CategoryItem[] = [];
  editingId: string | null = null;

  form = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    description: [""]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categoriesService.list().subscribe((data) => (this.categories = data));
  }

  edit(category: CategoryItem): void {
    this.editingId = category.id;
    this.form.patchValue({ name: category.name, description: category.description ?? "" });
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue() as { name: string; description?: string };

    const action = this.editingId
      ? this.categoriesService.update(this.editingId, payload)
      : this.categoriesService.create(payload);

    action.subscribe(() => {
      this.editingId = null;
      this.form.reset();
      this.load();
    });
  }

  remove(id: string): void {
    this.categoriesService.delete(id).subscribe(() => this.load());
  }
}
