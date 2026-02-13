import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-excluded-dialog',
  templateUrl: './excluded-dialog.component.html',
  styleUrls: ['./excluded-dialog.component.css']
})
export class ExcludedDialogComponent implements OnInit {
  reasons: string[] = [];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.reasons = navigation?.extras?.state?.['reasons'] || [];
  }

  ngOnInit(): void {

  }
}
