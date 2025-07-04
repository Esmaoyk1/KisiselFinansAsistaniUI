import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AccountApiService {

  private apiUrl = environment.apiUrl +'/Accounts';
  //private apiUrl = 'http://localhost:5177/api/Accounts';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getUserTransactionReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/UserTransactionReport`);
  }

  getUserAccountBalance(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/UserBalance`);
  }

  createPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, post);
  }

  updatePost(id: number, post: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  getPostById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`); 
  }
}
