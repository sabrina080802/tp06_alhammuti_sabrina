import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css',
})
export class ConnexionComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private userService: UserService) {}

  async onSubmit(): Promise<void> {
    if (this.email && this.password) {
      const result = await this.userService.login(this.email, this.password);
      if (result.success) {
        this.router.navigate(['/']);
      }
    } else {
      console.log('Les champs sont invalides');
    }
  }

  redirectToRegister() {
    this.router.navigate(['/inscription']);
  }
}
