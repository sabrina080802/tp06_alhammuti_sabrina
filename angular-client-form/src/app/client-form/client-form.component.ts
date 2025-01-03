import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService, User, defaultUser } from '../user.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
})
export class ClientFormComponent {
  user: User;

  constructor(private router: Router, private userService: UserService) {
    this.user = this.userService.user;
  }

  async onSubmit(clientForm: NgForm) {
    if (!clientForm.valid) {
      alert('Il manque un renseignement ou celui-ci est incomplet !');
      return;
    }

    await this.userService.updateProfil({ ...clientForm.value });
    this.router.navigate(['/recap']);
  }
}
