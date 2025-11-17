import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArquivoDetalhadoDto } from '../models/arquivoDetalhadoDto';
import { ArquivoDto } from '../models/arquivoDto';
import { UploadResultDto } from '../models/uploadResultDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArquivosService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/Arquivos`;

  apiArquivosExpiredDelete(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/expired`);
  }

  apiArquivosGet(): Observable<ArquivoDto[]> {
    return this.http.get<ArquivoDto[]>(this.baseUrl);
  }

  apiArquivosIdDelete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  apiArquivosIdGet(id: number): Observable<ArquivoDetalhadoDto> {
    return this.http.get<ArquivoDetalhadoDto>(`${this.baseUrl}/${id}`);
  }

  apiArquivosUploadPost(file: File): Observable<UploadResultDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResultDto>(`${this.baseUrl}/upload`, formData);
  }
}
