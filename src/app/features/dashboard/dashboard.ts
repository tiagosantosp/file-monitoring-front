import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EstatisticasDto } from '../../core/models/estatisticasDto';
import { DashboardService } from '../../core/services/dashboard.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgxChartsModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  statistics$: Observable<EstatisticasDto | null> | undefined;
  chartData: any[] = [];
  view: [number, number] = [700, 400]; // Chart dimensions
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Status';
  showYAxisLabel = true;
  yAxisLabel = 'Quantidade de Arquivos';
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28'], // Green for received, Red for not received
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.statistics$ = this.dashboardService.apiDashboardEstatisticasGet().pipe(
      map((stats) => {
        this.chartData = [
          {
            name: 'Recepcionados',
            value: stats.arquivosRecepcionados || 0,
          },
          {
            name: 'Não Recepcionados',
            value: stats.arquivosNaoRecepcionados || 0,
          },
        ];
        return stats;
      }),
      catchError((error) => {
        console.error('Error fetching dashboard statistics', error);
        return of(null);
      })
    );
  }
}
