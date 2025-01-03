import { Pipe, PipeTransform } from '@angular/core';
import { Card } from './card.model';

@Pipe({
  name: 'cardFilter',
})
export class CardFilterPipe implements PipeTransform {
  transform(cards: Card[], searchTerm: string): Card[] {
    if (!cards || !searchTerm) {
      return cards;
    }
    return cards.filter(
      (card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.expiryYear.includes(searchTerm)
    );
  }
}
