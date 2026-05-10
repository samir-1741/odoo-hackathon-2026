import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://localhost:5000/api/ai';

  constructor(private http: HttpClient) {}

  chatWithAi(message: string, history: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat`, { message, history });
  }
}
