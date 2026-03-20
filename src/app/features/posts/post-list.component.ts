import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { CategoriesService, CategoryItem } from "../../core/services/categories.service";
import { PostItem, PostsService } from "../../core/services/posts.service";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-post-list",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: "./post-list.component.html",
  styleUrl: "./post-list.component.css"
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: PostItem[] = [];
  categories: CategoryItem[] = [];
  meta = { page: 1, limit: 10, total: 0, totalPages: 1 };
  private searchSubject = new Subject<void>();

  filters: Record<string, string | number> = {
    search: "",
    status: "",
    categoryId: "",
    page: 1,
    limit: 10
  };

  constructor(
    private readonly postsService: PostsService,
    private readonly categoriesService: CategoriesService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.categoriesService.list().subscribe((categories) => (this.categories = categories));
    this.searchSubject.pipe(debounceTime(350)).subscribe(() => {
      this.filters.page = 1;
      this.loadPosts();
    });
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onSearchInput(): void {
    this.searchSubject.next();
  }

  onFilterChange(): void {
    this.filters.page = 1;
    this.loadPosts();
  }

  loadPosts(): void {
    this.postsService.list(this.filters).subscribe((response) => {
      this.posts = response.data;
      this.meta = response.meta;
    });
  }

  previousPage(): void {
    const page = Number(this.filters.page) - 1;
    this.filters.page = Math.max(1, page);
    this.loadPosts();
  }

  nextPage(): void {
    const page = Number(this.filters.page) + 1;
    this.filters.page = Math.min(this.meta.totalPages, page);
    this.loadPosts();
  }

  getCategoryNames(post: PostItem): string {
    const names = post.categories.map((category) => category.name);
    return names.length ? names.join(", ") : "Sin categoria";
  }
}
