import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { makeStateKey, TransferState, StateKey } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <h1>Yazılar</h1>
    <ul>
      <li *ngFor="let article of articles">{{ article.makaleadi }}</li>
    </ul>
  `,
})
export class AppComponent implements OnInit {
  articles: any[] = [];

  private readonly articlesKey: StateKey<any[]> = makeStateKey<any[]>('articles');
  private readonly apiUrl = 'https://instagrm.com.tr/Admin/tummakalelerigetir';

  constructor(
    private readonly http: HttpClient,
    private readonly transferState: TransferState,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.articles = this.transferState.get(this.articlesKey, []);
    }

    if (this.articles.length === 0) {
      this.fetchArticles()
        .pipe(
          tap((articles) => {
            if (isPlatformBrowser(this.platformId)) {
              this.transferState.set(this.articlesKey, articles);
            }
          })
        )
        .subscribe((articles) => {
          this.articles = articles;
        });
    }
  }

  private fetchArticles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
