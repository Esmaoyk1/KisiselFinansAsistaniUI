import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class BanksApiService {
  private apiUrl = environment.apiUrl + '/Banks';
  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getBankId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, post);
  }

  //updatePost(id: number, post: any): Observable<any> {
  //  return this.http.put<any>(`${this.apiUrl}/update/${id}`, post);
  //}

  //updatePost(id: number, updatedBank: any): Observable<any> {
  //  return this.http.put(`http://localhost:5177/api/Banks/update/${id}`, updatedBank);
  //}
  updatePost(id: number, post: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, post);
  }
  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getAccountType(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hesapturleri`);
  }
}
