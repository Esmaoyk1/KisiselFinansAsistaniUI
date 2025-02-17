import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpClientModule } from '@angular/common/http'
import { environment } from '../../environment';


@Injectable({ providedIn: 'root' })
export class UserapiService {

  private apiUrl = environment.apiUrl + '/User';
  //private apiUrl = 'http://esmaapp.somee.com/api/User/signup';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  loginPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, post);
  }
  signupPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, post);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }
  forgotPassword(data : any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data );
  }
  createPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, post);
  }

  updatePost(id: number, post: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`);
  }


  getUserProfilePicture(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-profile-pictures`);
  }


  getUserDetail(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-user-detail`); 
  }
  updateUserDetail(post: any, userId?: number): Observable<any> {

    const url = userId
      ? `${this.apiUrl}/update-user-profile?targetUserId=${userId}`
      : `${this.apiUrl}/update-user-profile`; // ID yoksa sadece temel URL

    return this.http.put<any>(url,post);
  }

  // user-api.service.ts
  uploadProfilePicture(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload-profile-picture`, formData);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-users`);
  }

  updateRating(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-rating`, post);
  }

  getRating(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-rating`);
  }

  getUserCountsByDate(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/countByDate`);
  }
 
 
}
