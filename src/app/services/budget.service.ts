import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  //  apiUrl: 'http://localhost:5177/api'
  private apiUrl = environment.apiUrl + '/Budget';
  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
  getPostsBudgetByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/BudgetByUser/${userId}`);
  }

  createPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, post);
  }

  updatePost(id: number, post: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, post);
  }
  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }


}
