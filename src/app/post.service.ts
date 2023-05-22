import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http'
import { Post } from './post.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  endPointURL:string = 'https://http-v-eleven-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postURL:string = this.endPointURL+'post.json';

  errorHandling = new Subject<any>();

  constructor(private http: HttpClient) { }

  // for posting data
  createAndPost(postData: Post){
    this.http.post<{name : string}>(this.postURL, postData,{
      observe:'response'
    }).subscribe(
      (data) => {
        console.log(data)
        this.errorHandling.next(null)
      },
      (error) => {
        this.errorHandling.next(error)
      }
    )
  }

  // for fetching data
  fetchPosts(){
    let customParam = new HttpParams();
    customParam = customParam.append('print','pretty')
    customParam = customParam.append('custom-param','custom-param-value');
    return this.http.get<{[key:string] :Post}>(this.postURL,{
      headers: new HttpHeaders({
        'custom-header' : 'hello from custom header'
      }),
      params: customParam,
    })
    .pipe(
      map( responseData => {
        const postArray: Post[] = [];
        for(const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postArray.push({...responseData[key],id:key})
          }
        }
        return postArray;
      }),
      catchError(
        errorRes => {
          return throwError(errorRes)
        }
      )
    )
  }

  // for deleting data
  deletePosts(){
    return this.http.delete(this.postURL,{
      observe:'events'
    }).pipe(
      tap(
        event=>{
          console.log(event)
          if(event.type == HttpEventType.Sent){

          }

          if(event.type == HttpEventType.Response){

          }
        }
      )
    )
  }

  // for deleteing once data
  deletePost(postData:Post){
    console.log(postData)
    let data = {[postData.id]: { title: "", content: "" }};

    this.http.patch(this.postURL, data).subscribe(
      (data) => {
        console.log(data);
      }
    );
  }
}
