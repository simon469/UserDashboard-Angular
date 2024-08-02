import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { IStaticMethods } from 'preline/preline';
import { UserService } from './service/user.service';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'assessment-project';
  searchTerm = new FormControl('')

  constructor(private router: Router, private userService: UserService) {

  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    });
    this.userService.getAllUsers()
    this.searchTerm.valueChanges.subscribe(value => {
      this.userService.setSearchTerm(value as string)
      this.userService.searchUsers(value as string)
    })
  }
}
