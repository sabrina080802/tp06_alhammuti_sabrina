import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { CartItem } from './cart.model';
import { Store } from '@ngxs/store';
import { CartState } from './cart.state';
import { Product } from '../product';
import { RemoveProduct, ClearCart } from './cart.state';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  items!: Observable<{ product: Product; count: number }[]>;
  total!: Observable<number>;
  count!: Observable<number>;

  constructor(private store: Store) {
    this.count! = this.store.select(CartState.count);
    this.items! = this.store.select(CartState.list);
    this.total! = this.store.select(CartState.total);
  }

  removeFromCart(product: Product) {
    this.store.dispatch(new RemoveProduct(product));
  }

  clearCart() {
    this.store.dispatch(new ClearCart());
  }
}
