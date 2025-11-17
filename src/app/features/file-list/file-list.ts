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
import { ArquivoDto, ArquivosService } from '../../core/api';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

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
    'quantidadeTransacoes',
    'actions',
  ];
  dataSource = new MatTableDataSource<ArquivoDto>();
  isLoading = false;
  uploading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private arquivosService: ArquivosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadFiles(): void {
    this.isLoading = true;
    this.arquivosService
      .apiArquivosGet()
      .pipe(
        catchError((error) => {
          console.error('Error fetching files', error);
          this.snackBar.open('Erro ao carregar arquivos.', 'Fechar', {
            duration: 3000,
          });
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
          this.snackBar.open('Erro ao fazer upload do arquivo.', 'Fechar', {
            duration: 3000,
          });
          return of(null);
        }),
        finalize(() => {
          this.uploading = false;
          // Clear the file input
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
        })
      )
      .subscribe((result) => {
        if (result?.sucesso) {
          this.snackBar.open('Arquivo enviado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.loadFiles(); // Reload files after successful upload
        } else {
          this.snackBar.open(
            `Falha no upload: ${result?.mensagem || 'Erro desconhecido'}`,
            'Fechar',
            { duration: 3000 }
          );
        }
      });
  }

  deleteFile(id: number): void {
    if (confirm('Tem certeza que deseja excluir este arquivo?')) {
      this.arquivosService
        .apiArquivosIdDelete(id)
        .pipe(
          catchError((error) => {
            console.error('Error deleting file', error);
            this.snackBar.open('Erro ao excluir arquivo.', 'Fechar', {
              duration: 3000,
            });
            return of(null);
          })
        )
        .subscribe(() => {
          this.snackBar.open('Arquivo excluído com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.loadFiles(); // Reload files after successful deletion
        });
    }
  }
}
