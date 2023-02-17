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
        path: 'monthly/JANUARY',
        component: MonthlyComponent,
        title: 'January Overview',
      },
      {
        path: 'monthly/FEBRUARY',
        component: MonthlyComponent,
        title: 'February Overview',
      },
      {
        path: 'monthly/MARCH',
        component: MonthlyComponent,
        title: 'March Overview',
      },
      {
        path: 'monthly/APRIL',
        component: MonthlyComponent,
        title: 'April Overview',
      },
      {
        path: 'monthly/MAY',
        component: MonthlyComponent,
        title: 'May Overview',
      },
      {
        path: 'monthly/JUNE',
        component: MonthlyComponent,
        title: 'June Overview',
      },
      {
        path: 'monthly/JULY',
        component: MonthlyComponent,
        title: 'July Overview',
      },
      {
        path: 'monthly/AUGUST',
        component: MonthlyComponent,
        title: 'August Overview',
      },
      {
        path: 'monthly/SEPTEMBER',
        component: MonthlyComponent,
        title: 'September Overview',
      },
      {
        path: 'monthly/OCTOBER',
        component: MonthlyComponent,
        title: 'October Overview',
      },
      {
        path: 'monthly/NOVEMBER',
        component: MonthlyComponent,
        title: 'November Overview',
      },
      {
        path: 'monthly/DECEMBER',
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
