import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SEPHORA_PRODUCTS_MOCK } from './sephora-products.mock';
import { Product } from './product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SephoraProductService {
  constructor(private readonly httpClient: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('/api/catalogue');
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    category = category.toLowerCase().trim();
    if (category == 'toutes les catégories' || category == '')
      return this.getProducts();

    return of(
      SEPHORA_PRODUCTS_MOCK.filter(
        (x) => x.category.toLowerCase().trim() == category
      )
    );
  }

  getProductsByPrice(
    minPrice: number,
    maxPrice: number
  ): Observable<Product[]> {
    if (minPrice == 0 || maxPrice == 0) return this.getProducts();

    return of(
      SEPHORA_PRODUCTS_MOCK.filter(
        (x) => x.price < maxPrice && x.price > minPrice
      )
    );
  }

  getProductsByName(name: string): Observable<Product[]> {
    name = name.toLowerCase().trim();
    if (name == null || name == '') return this.getProducts();

    return of(
      SEPHORA_PRODUCTS_MOCK.filter((x) => x.name.toLowerCase().includes(name))
    );
  }
}
