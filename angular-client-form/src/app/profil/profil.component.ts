import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
})
export class ProfilComponent {
  user: User | undefined;

  constructor(private router: Router, private userService: UserService) {
    this.user = this.userService.user;
  }

  onHome() {
    this.router.navigate(['/']);
  }
}
