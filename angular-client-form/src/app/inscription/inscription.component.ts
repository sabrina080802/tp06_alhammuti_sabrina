import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
})
export class InscriptionComponent {
  client: User;

  constructor(private router: Router, private userService: UserService) {
    this.client = {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      address: '',
      postal_code: '',
      city: '',
      gender: '',
      country: '',
      phone: '',
    };
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      alert('Il manque un renseignement ou celui-ci est incomplet !');
      return;
    }

    const userData: User = {
      id: '',
      ...form.value,
    };
    const registerResult = await this.userService.register(userData);
    console.log(registerResult);
  }
}
