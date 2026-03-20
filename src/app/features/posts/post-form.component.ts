import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CategoriesService, CategoryItem } from "../../core/services/categories.service";
import { PostsService } from "../../core/services/posts.service";
import { ApiService } from "../../core/services/api.service";

@Component({
  selector: "app-post-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./post-form.component.html",
  styleUrl: "./post-form.component.css"
})
export class PostFormComponent implements OnInit {
  isEdit = false;
  postId = "";
  categories: CategoryItem[] = [];
  selectedCategoryIds: string[] = [];
  error = "";
  imagePreview: string | null = null;
  imageUrl: string | null = null;
  uploading = false;

  form = this.fb.group({
    title: ["", [Validators.required, Validators.minLength(5)]],
    content: ["", [Validators.required, Validators.minLength(20)]],
    status: ["draft", [Validators.required]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoriesService: CategoriesService,
    private readonly postsService: PostsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.categoriesService.list().subscribe((categories) => (this.categories = categories));

    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit = true;
      this.postId = id;
      this.postsService.getById(id).subscribe((post) => {
        this.form.patchValue({
          title: post.title,
          content: post.content,
          status: post.status
        });
        this.selectedCategoryIds = post.categories.map((c) => c.id);
        if (post.imageUrl) {
          this.imageUrl = post.imageUrl;
          this.imagePreview = post.imageUrl;
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.uploading = true;
    this.error = "";

    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    this.http.post<{ url: string }>(`${this.api.baseUrl}/uploads`, formData).subscribe({
      next: (res) => {
        this.imageUrl = res.url;
        this.uploading = false;
      },
      error: () => {
        this.error = "Error al subir la imagen";
        this.imagePreview = null;
        this.uploading = false;
      }
    });
  }

  removeImage(): void {
    this.imageUrl = null;
    this.imagePreview = null;
  }

  toggleCategory(categoryId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCategoryIds = [...this.selectedCategoryIds, categoryId];
      return;
    }

    this.selectedCategoryIds = this.selectedCategoryIds.filter((id) => id !== categoryId);
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.getRawValue(),
      categoryIds: this.selectedCategoryIds,
      imageUrl: this.imageUrl ?? undefined
    } as { title: string; content: string; status: string; categoryIds: string[]; imageUrl?: string };

    const action = this.isEdit ? this.postsService.update(this.postId, payload) : this.postsService.create(payload);

    action.subscribe({
      next: (post) => this.router.navigate(["/posts", post.id]),
      error: (err) => {
        this.error = err?.error?.message ?? "No se pudo guardar";
      }
    });
  }
}
