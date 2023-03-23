import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MonthlyComponent } from './pages/monthly/monthly.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { UploadComponent } from './pages/upload/upload.component';
import { YearlyComponent } from './pages/yearly/yearly.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: OverviewComponent },
      {
        path: 'overview',
        component: OverviewComponent,
        title: 'General Overview',
      },
      {
        path: 'monthly/January',
        component: MonthlyComponent,
        title: 'January Overview',
      },
      {
        path: 'monthly/February',
        component: MonthlyComponent,
        title: 'February Overview',
      },
      {
        path: 'monthly/March',
        component: MonthlyComponent,
        title: 'March Overview',
      },
      {
        path: 'monthly/April',
        component: MonthlyComponent,
        title: 'April Overview',
      },
      {
        path: 'monthly/May',
        component: MonthlyComponent,
        title: 'May Overview',
      },
      {
        path: 'monthly/June',
        component: MonthlyComponent,
        title: 'June Overview',
      },
      {
        path: 'monthly/July',
        component: MonthlyComponent,
        title: 'July Overview',
      },
      {
        path: 'monthly/August',
        component: MonthlyComponent,
        title: 'August Overview',
      },
      {
        path: 'monthly/September',
        component: MonthlyComponent,
        title: 'September Overview',
      },
      {
        path: 'monthly/October',
        component: MonthlyComponent,
        title: 'October Overview',
      },
      {
        path: 'monthly/November',
        component: MonthlyComponent,
        title: 'November Overview',
      },
      {
        path: 'monthly/December',
        component: MonthlyComponent,
        title: 'December Overview',
      },
    ],
  },
  { path: 'monthly', component: MonthlyComponent, title: 'Monthly Overview' },
  { path: 'yearly', component: YearlyComponent, title: 'Yearly Overview' },
  { path: 'upload', component: UploadComponent, title: 'Upload CSV' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
