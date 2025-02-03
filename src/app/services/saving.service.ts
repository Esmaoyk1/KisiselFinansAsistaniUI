//import { TestBed } from '@angular/core/testing';
//import { HttpClient } from '@angular/common/http';
//import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/internal/Observable';




//@Injectable({
//  providedIn: 'root'
//})
//export class SavingApiService {

//  private apiUrl = 'http://localhost:5177/api/Saving';

//  constructor(private http: HttpClient) { }

//  getPosts(): Observable<any> {
//    return this.http.get<any>(`${this.apiUrl}`);
//  }

//  getSavedAmount(id: number): Observable<any> {
//    return this.http.get<any>(`${this.apiUrl}/UserAmount/${id}`);
//  }

//  createPost(post: any): Observable<any> {
//    return this.http.post<any>(`${this.apiUrl}`, post);
//  }

//  //updatePost(id: number, post: any): Observable<any> {
//  //  return this.http.put<any>(`${this.apiUrl}/${id}`, post);
//  //}

//  updatePost(id: number, post: any): Observable<any> {
//    return this.http.put<any>(`${this.apiUrl}/update/${id}`, post);
//  }

//  deletePost(id: number): Observable<any> {
//    return this.http.delete<any>(`${this.apiUrl}/${id}`);
//  }
//  GetLastFiveByUser(id: number): Observable<any> {
//    return this.http.get<any>(`${this.apiUrl}/SavingLastFiveByUser/ ${id}`);
//  }
//}


import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environment';





@Injectable({
  providedIn: 'root'
})
export class SavingApiService {

  private apiUrl = environment.apiUrl + '/Saving';
  //private apiUrl = 'http://localhost:5177/api/Saving';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getSavedAmount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/UserAmount`);
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
  GetLastFiveByUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/SavingLastFiveByUser`);
  }

  getPostById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/saving/${id}`); // API URL'sini güncelleyin
  }

  GetHighSavingsByUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/HighSavings`); 
  }
}
