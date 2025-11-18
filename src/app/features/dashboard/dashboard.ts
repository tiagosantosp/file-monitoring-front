import { Component, OnInit, HostListener, ElementRef } from '@angular/core'; // Import HostListener, ElementRef
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EstatisticasDto } from '../../core/models/estatisticasDto';
import { DashboardService } from '../../core/services/dashboard.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgxChartsModule,
    MatSnackBarModule,
    MatButtonModule, // Add MatButtonModule
    MatIconModule, // Add MatIconModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  statistics: EstatisticasDto | null = null; // Changed from Observable to direct property
  chartData: any[] = [];
  view: [number, number] = [900, 500]; // Initial chart dimensions
  showXAxis = false;
  showYAxis = false;
  gradient = false;
  showLegend = true;
  showXAxisLabel = false;
  showYAxisLabel = false;
  showLabels = true;
  doughnut = false;
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28'], // Green for received, Red for not received
  };

  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    private elementRef: ElementRef // Inject ElementRef
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.onResize(); // Call onResize initially to set the correct size
  }

  @HostListener('window:resize')
  onResize(): void {
    const containerWidth = this.elementRef.nativeElement.querySelector('.chart-container').offsetWidth;
    // Adjust height proportionally or set a fixed height for mobile
    const newWidth = Math.min(containerWidth, 900); // Max width 900px
    const newHeight = newWidth * (500 / 900); // Maintain aspect ratio
    this.view = [newWidth, newHeight];
  }

  loadStatistics(): void {
    this.statistics = null; // Clear previous data
    this.dashboardService.apiDashboardEstatisticasGet().pipe(
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
        this.statistics = null; // Set to null on error
        return of(null);
      })
    ).subscribe((stats) => {
      this.statistics = stats; // Assign fetched data directly
    });
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

  clearCache(): void {
    this.dashboardService.apiDashboardLimparCachePost().pipe(
      catchError((error) => {
        console.error('Error clearing cache', error);
        this.openSnackBar(this.getErrorMessage(error), 'Fechar');
        return of(null);
      })
    ).subscribe((response) => {
      if (response) { // Assuming a successful response is not null
        this.openSnackBar('Cache limpo com sucesso!', 'Fechar');
        this.loadStatistics(); // Reload data after clearing cache
      }
    });
  }
}
