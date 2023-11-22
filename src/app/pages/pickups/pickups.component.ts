import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-pickups',
  templateUrl: './pickups.component.html',
  styleUrls: ['./pickups.component.css'],
})
export class PickupsComponent {
  pups: any[] = [];
  pup: string[] = [];
  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.getPickup().subscribe((response) => {
      this.pups = response;
      console.log(this.pups);
      for (let i = 0; i < this.pups.length; i++) {
        this.pup[i] = JSON.stringify(this.pups[i]);
      }
    });
  }
}
