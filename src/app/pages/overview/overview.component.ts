import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Overview } from 'src/app/Entities/Overview';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent {
  fromDb = undefined;
  Overview: Overview[];
  totals: number[] = this.fromDb || {};
  

  constructor(private get: DataService, private router: Router) {}
  ngOnInit(): void {
    this.get.getOverview().subscribe(
      (data) => {
        this.Overview = data;
      },
      (error) => {
        console.log(error);
      },
      () => {this.calcTotals();this.piechartCreate();}
    );
  }

  routeTo(String: string, String2) {
    this.router.navigate(['monthly/' + String]);
    localStorage.setItem('month', String);
    localStorage.setItem('year', String2);
  }

  calcTotals(){
    for(let i =0;i<this.Overview.length;i++){
      var total = 0.0;
      for(let j = 0; j<this.Overview[i].bestMonths.length; j++){
       
        total+= this.Overview[i].monthPrices[j];
      }
   
      this.totals[i] = total;
    }
  }
  // piechartCreate(){
  //   let a:number =  (this.Overview[0].channelTotals[0]/100) * 360;

  //   console.log(this.Overview[2].channelTotals);
  //   console.log(a,b,c);
  //   var pie = 'conic-gradient'+'(' +
  //     'rgb(243, 71, 71)'+ a+'deg,'+ 
  //     'lightblue' + '0'+ b+'deg,'+ 
  //     'orange'+ c+');';
  //     document.getElementById('piechart').style.backgroundImage = pie;
      
  // }
}
