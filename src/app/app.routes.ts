import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/components/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard';
import { FileListComponent } from './features/file-list/file-list';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'files', component: FileListComponent },
    ],
  },
];
