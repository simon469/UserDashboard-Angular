import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import User from '../../models/User';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  users: User[] | null = null
  currentPage: number = 1
  totalPages!: number
  totalUsers!: number
  start: number = 1
  end: number = 6
  

  constructor(private userService: UserService) { }

  prevPage() {
    if (this.currentPage > 1) {
      this.userService.setCurrentPage(this.currentPage - 1)
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.userService.setCurrentPage(this.currentPage + 1)
    }
  }

  ngOnInit() {
    this.userService.currentPage$.subscribe(page => {
      this.currentPage = page
      this.userService.searchResults$.subscribe(users => {
        this.userService.searchTerm$.subscribe(searchTerm => {
          if (users.length > 0 || searchTerm.length !== 0) {
            if (page === 1) {
              this.users = users.slice(0,6)
              this.start = 1
              this.end = 6 < users.length ? 6 : users.length
            } else {
              this.users = users.slice(6)
              this.start = 7
              this.end = users.length
            }
            this.totalPages = Math.ceil(users.length / 6)
            this.totalUsers = users.length
          } else {
            this.userService.getUsers(page).subscribe(users => {
              this.users = users.data
              this.totalPages = users.total_pages
              this.totalUsers = users.total
              if (page === 1) {
                this.start = 1
                this.end = users.per_page
              } else {
                this.start = users.per_page + 1
                this.end = users.page * users.per_page
              }
            })
          }
        })
      })
    })
  }
}
