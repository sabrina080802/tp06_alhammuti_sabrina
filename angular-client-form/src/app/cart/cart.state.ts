import { Selector, Action, State } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Product } from '../product';
import { StateContext } from '@ngxs/store';
import { StateStorageService } from './StateStorageService.service';

type ProductStateModel = { [key: number]: Product };
type CountStateModel = { [key: number]: number };

export type CartStateModel = {
  products: ProductStateModel;
  counts: CountStateModel;
};

export class AddProduct {
  static readonly type = '[Cart] Add Product';
  constructor(public product: Product) {}
}
export class RemoveProduct {
  static readonly type = '[Cart] Remove Product';
  constructor(public product: Product) {}
}
export class ClearCart {
  static readonly type = '[Cart] Clear Cart';
  constructor() {}
}

const defaults = {
  products: {},
  counts: {},
};

@State<CartStateModel>({
  name: 'cart',
  defaults,
})
@Injectable()
export class CartState {
  constructor(private storageService: StateStorageService) {}

  private getInitialState(): CartStateModel {
    const savedState = this.storageService.getState();
    return savedState ? savedState : defaults;
  }

  ngxsOnInit(ctx: StateContext<CartStateModel>): void {
    ctx.setState(this.getInitialState());
  }

  @Action(ClearCart)
  clearCart(ctx: StateContext<CartStateModel>, action: ClearCart) {
    ctx.setState(Object.assign({}, defaults));
    this.storageService.saveState(defaults);
  }

  @Action(RemoveProduct)
  removeProduct(ctx: StateContext<CartStateModel>, action: RemoveProduct) {
    const state = ctx.getState();
    const product = action.product;

    if (state.products[product.id]) {
      const products = { ...state.products };
      const counts = { ...state.counts };
      if (--counts[product.id] <= 0) {
        delete products[product.id];
        delete counts[product.id];
      }

      ctx.setState({ products, counts });
      this.storageService.saveState({ products, counts });
    }
  }
  @Action(AddProduct)
  addProduct(ctx: StateContext<CartStateModel>, action: AddProduct) {
    const state = ctx.getState();
    const product = action.product;

    const products = { ...state.products, [product.id]: product };
    const counts = {
      ...state.counts,
      [product.id]: (state.counts[product.id] || 0) + 1,
    };

    ctx.setState({ products, counts });
    this.storageService.saveState({ products, counts });
  }

  @Selector()
  static count(state: CartStateModel): number {
    return Object.values(state.counts).reduce((acc, count) => acc + count, 0);
  }
  @Selector()
  static list(state: CartStateModel): { product: Product; count: number }[] {
    return Object.keys(state.counts).map((id) => ({
      product: state.products[+id],
      count: state.counts[+id],
    }));
  }
  @Selector()
  static total(state: CartStateModel): number {
    return Object.keys(state.products).reduce((acc, id) => {
      const product = state.products[+id];
      const count = state.counts[+id];
      return acc + product.price * count;
    }, 0);
  }

  static get defaults() {
    return defaults;
  }
}
