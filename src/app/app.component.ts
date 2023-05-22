import { Component, OnInit, ViewChild , OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit , OnDestroy {
  endPointURL:string = 'https://http-v-eleven-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postURL: string = this.endPointURL+'post.json'
  loadedPosts = [];
  showLoading = false;

  //
  id:String = "";
  title:String = "";
  content:String = "";

  inPost:Post[] = [];

  errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {}
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  ngOnInit() {
    this.errorSub = this.postService.errorHandling.subscribe(
      error =>{
        this.error = error;
      }
    )
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndPost(postData);
  }

  onFetchPosts() {
    // Send Http request
    this.fecthPosts();
  }

  onClearPosts() {
    // Send Http request
    this.showLoading = true
    this.postService.deletePosts().subscribe(
      (data) => {
        this.showLoading = false;
        this.loadedPosts = [];
      }
    )
  }

  onDeletePost(post:Post) {
    this.postService.deletePost(post);
  }

  onClickPost(post:Post){
    // Click Detail Post

    this.id = post.id;
    this.title = post.title;
    this.content = post.content;

  }

  onUpdatePosts(postData: Post){
    console.log(postData)
    let data = {[postData.id]: { title: postData.title, content: postData.content }};

    this.http.patch(this.postURL, data).subscribe(
      (data) => {
        alert("Your Data Updated")
        this.id = "";
        this.title = "";
        this.content = "";
        this.fecthPosts();
      }
    );
  }

  error = null;
  private fecthPosts(){
    this.showLoading = true;
    this.postService.fetchPosts()
    .subscribe(
      posts => {
        this.showLoading = false;
        this.loadedPosts = posts;
      },error => {
        console.log(error)
        this.error = error
      }
    )
  }
}
