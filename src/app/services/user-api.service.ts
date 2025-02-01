import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpClientModule } from '@angular/common/http'
import { environment } from '../../environment';


@Injectable({ providedIn: 'root' })
export class UserapiService {

  private apiUrl = environment.apiUrl + '/User';
  //private apiUrl = 'http://esmaapp.somee.com/api/User/signup';



  /* POST
 /api/User / login
 POST
   / api / User / Logout
 POST
   / api / User / signup
   */

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
  createPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, post);
  }

  updatePost(id: number, post: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /*'http://localhost:5177/api/User/get-profile-picture?userId=20' \*/


  getUserProfilePicture(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-profile-pictures`);
  }


  getUserDetail(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-user-detail`); 
  }
  updateUserDetail(post: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-user-detail`,post);
  }

  // user-api.service.ts
  uploadProfilePicture(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload-profile-picture`, formData);
  }


  

}
