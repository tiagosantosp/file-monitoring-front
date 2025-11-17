import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EstatisticasDto } from '../../core/models/estatisticasDto';
import { DashboardService } from '../../core/services/dashboard.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar and MatSnackBarModule

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgxChartsModule,
    MatSnackBarModule, // Add MatSnackBarModule to imports
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  statistics$: Observable<EstatisticasDto | null> | undefined;
  chartData: any[] = [];
  view: [number, number] = [900, 500]; // Chart dimensions increased
  showXAxis = false; // Changed for pie chart
  showYAxis = false; // Changed for pie chart
  gradient = false;
  showLegend = true;
  showXAxisLabel = false; // Changed for pie chart
  showYAxisLabel = false; // Changed for pie chart
  showLabels = true; // Added for pie chart
  doughnut = false; // Changed to false for a regular pie chart
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28'], // Green for received, Red for not received
  };

  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

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
        this.openSnackBar(this.getErrorMessage(error), 'Fechar');
        return of(null);
      })
    );
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }

  private getErrorMessage(error: any): string {
    if (error && error.error && error.error.mensagem) {
      return error.error.mensagem;
    }
    return 'Ocorreu um erro inesperado ao carregar as estatísticas.';
  }
}
