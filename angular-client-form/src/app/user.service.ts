import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

export interface ApiResponse {
  success: boolean;
  error: string;
}
export interface LoginResponse extends ApiResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  postal_code: string;
  city: string;
  gender: string;
  country: string;
  phone: string;
  password: string;
}
export const defaultUser: User = {
  id: '',
  firstname: '',
  lastname: '',
  email: '',
  address: '',
  postal_code: '',
  city: '',
  gender: 'Male',
  country: '',
  phone: '',
  password: '',
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #user: User = defaultUser;
  #token: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = window.localStorage.getItem('token');
      if (token) {
        this.#token.next(token);
      }

      const user = window.localStorage.getItem('user');
      if (user) this.#user = JSON.parse(user);
    }
  }
  get user(): User {
    return this.#user;
  }
  get token$(): Observable<string> {
    return this.#token.asObservable();
  }
  isConnected(): boolean {
    return this.#token.getValue() != '';
  }

  async updateProfil(newUserData: User) {
    const result = await firstValueFrom(
      this.http.post<ApiResponse>('/api/updateProfil', newUserData, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.#token.getValue()}`,
        }),
      })
    );
    if (result?.success) {
      this.#user = newUserData;
      window.localStorage.setItem('user', JSON.stringify(this.#user));
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const loginData = { email, password };
    const result = await firstValueFrom(
      this.http.post<LoginResponse>('/api/login', loginData)
    );

    if (result?.success) {
      if (isPlatformBrowser(this.platformId)) {
        window.localStorage.setItem('token', result.token);
        window.localStorage.setItem('user', JSON.stringify(result.user));
        this.#user = result.user;
        this.#token.next(result.token);
      }
    }

    return result;
  }
  async disconnect(): Promise<ApiResponse> {
    const token = this.#token.getValue();
    this.#token.next('');
    this.#user = defaultUser;

    return await firstValueFrom(
      this.http.post<ApiResponse>('/api/disconnect', null, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
    );
  }
  async register(user: User): Promise<ApiResponse> {
    return await firstValueFrom(
      this.http.post<ApiResponse>('/api/register', user)
    );
  }
}
