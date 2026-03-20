import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommentsService, CommentItem } from "../../core/services/comments.service";
import { PostItem, PostsService } from "../../core/services/posts.service";
import { AuthService } from "../../core/services/auth.service";
import { CommentFormComponent } from "../comments/comment-form.component";

@Component({
  selector: "app-post-detail",
  standalone: true,
  imports: [CommonModule, RouterLink, CommentFormComponent],
  templateUrl: "./post-detail.component.html",
  styleUrl: "./post-detail.component.css"
})
export class PostDetailComponent implements OnInit {
  post: PostItem | null = null;
  comments: CommentItem[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")!;
    this.loadPost(id);
    this.loadComments(id);
  }

  loadPost(id: string): void {
    this.postsService.getById(id).subscribe((post) => (this.post = post));
  }

  loadComments(postId: string): void {
    this.commentsService.listByPost(postId).subscribe((comments) => (this.comments = comments));
  }

  addComment(content: string): void {
    if (!this.post) return;
    this.commentsService.create(this.post.id, { content }).subscribe(() => this.loadComments(this.post!.id));
  }

  deleteComment(commentId: string): void {
    if (!this.post) return;
    this.commentsService.delete(this.post.id, commentId).subscribe(() => this.loadComments(this.post!.id));
  }

  canDeleteComment(comment: CommentItem): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    return user.role === "admin" || user.id === comment.author.id;
  }

  canEditPost(): boolean {
    const user = this.authService.getCurrentUser();
    if (!user || !this.post) return false;
    return user.role === "admin" || user.id === this.post.author.id;
  }

  deletePost(): void {
    if (!this.post) return;
    this.postsService.delete(this.post.id).subscribe(() => this.router.navigate(["/"]));
  }
}
