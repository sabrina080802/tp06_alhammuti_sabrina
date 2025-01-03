import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartState } from '../cart/cart.state';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-tertiary',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './tertiary.component.html',
  styleUrl: './tertiary.component.css',
})
export class TertiaryComponent {
  count!: Observable<number>;
  isConnected: boolean = false;

  constructor(
    private store: Store,
    private userService: UserService,
    private router: Router
  ) {
    this.count! = this.store.select(CartState.count);
    this.isConnected = userService.isConnected();

    this.userService.token$.subscribe(
      (token) => (this.isConnected = token != '')
    );
  }
  async disconnect() {
    await this.userService.disconnect();
    this.router.navigate(['/']);
  }
}
