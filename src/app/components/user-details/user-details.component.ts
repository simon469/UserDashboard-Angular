import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import User from '../../models/User';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  userId!: number
  user: User | null = null

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      console.log(params['id'])
      this.userId = params['id']
      this.userService.getUser(this.userId).subscribe(user => {
        this.user = user.data
      })
    })
  }
}
