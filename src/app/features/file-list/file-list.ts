import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ArquivoDto } from '../../core/models/arquivoDto';
import { ArquivosService } from '../../core/services/arquivos.service';
import { Observable, of } from 'rxjs';
import { catchError, finalize, filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../layout/components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
  ],
  templateUrl: './file-list.html',
  styleUrl: './file-list.scss',
})
export class FileListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'nomeArquivo',
    'dataRecebimento',
    'status',
    'tipoAdquirente',
    'tamanhoBytes',
    'mensagemErro',
    'actions',
  ];
  dataSource = new MatTableDataSource<ArquivoDto>();
  isLoading = false;
  uploading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private arquivosService: ArquivosService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    return 'Ocorreu um erro inesperado.';
  }

  formatStatus(status: string): string {
    if (status === 'NaoRecepcionado') {
      return 'Não Recepcionado';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Recepcionado':
        return 'status-processed';
      case 'NaoRecepcionado':
        return 'status-not-received';
      default:
        return '';
    }
  }

  loadFiles(): void {
    this.isLoading = true;
    this.arquivosService
      .apiArquivosGet()
      .pipe(
        catchError((error) => {
          console.error('Error fetching files', error);
          this.openSnackBar(this.getErrorMessage(error), 'Fechar');
          return of([]);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((files) => {
        this.dataSource.data = files;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const file = element.files[0];
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
    this.uploading = true;
    this.arquivosService
      .apiArquivosUploadPost(file)
      .pipe(
        catchError((error) => {
          console.error('Error uploading file', error);
          this.openSnackBar(this.getErrorMessage(error), 'Fechar');
          return of(null);
        }),
        finalize(() => {
          this.uploading = false;
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
        })
      )
      .subscribe((result) => {
        if (result === null) {
          return;
        }

        if (result.sucesso) {
          this.openSnackBar('Arquivo enviado com sucesso!', 'Fechar');
          this.loadFiles();
        } else {
          this.openSnackBar(
            `Falha no upload: ${result.mensagem || 'Erro desconhecido.'}`,
            'Fechar'
          );
        }
      });
  }

  deleteFile(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o arquivo de ID ${id}?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result) => result))
      .subscribe(() => {
        this.arquivosService
          .apiArquivosIdDelete(id)
          .pipe(
            catchError((error) => {
              console.error('Error deleting file', error);
              this.openSnackBar(this.getErrorMessage(error), 'Fechar');
              return of(null);
            })
          )
          .subscribe((result) => {
            if (result !== null) {
              this.openSnackBar('Arquivo excluído com sucesso!', 'Fechar');
              this.loadFiles();
            }
          });
      });
  }
}
