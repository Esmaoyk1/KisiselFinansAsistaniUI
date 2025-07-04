import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environment';


@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {

  private apiUrl = environment.apiUrl + '/Categories';
  //private apiUrl = 'http://localhost:5177/api/Categories';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }


  createPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, post);
  }

  updatePost( post: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getCategoryById/${id}`);
  }

}
