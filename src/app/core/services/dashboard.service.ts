import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstatisticasDto } from '../models/estatisticasDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/Dashboard`;

  apiDashboardEstatisticasGet(): Observable<EstatisticasDto> {
    return this.http.get<EstatisticasDto>(`${this.baseUrl}/estatisticas`);
  }

  apiDashboardLimparCachePost(): Observable<any> {
    return this.http.post(`${this.baseUrl}/limpar-cache`, {});
  }

  apiDashboardResumoGet(): Observable<any> {
    return this.http.get(`${this.baseUrl}/resumo`);
  }
}
