import { Injectable } from '@angular/core';
import { Card } from './card.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private cardsSubject = new BehaviorSubject<Card[]>(this.loadCards());
  private editingCardSubject = new BehaviorSubject<Card | null>(null);
  cards$ = this.cardsSubject.asObservable();
  editingCard$ = this.editingCardSubject.asObservable();

  constructor() {
    if (this.getCards().length == 0) {
      const initialCards: Card[] = [
        {
          id: 1,
          name: 'Carte 1',
          cardNumber: '1234567812345678',
          ccv: '123',
          expiryMonth: '12',
          expiryYear: '2025',
        },
        {
          id: 2,
          name: 'Carte 2',
          cardNumber: '2345678923456789',
          ccv: '456',
          expiryMonth: '11',
          expiryYear: '2024',
        },
      ];
      this.cardsSubject.next(initialCards);
    }
  }

  private isBrowser(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }

  private loadCards(): Card[] {
    if (this.isBrowser()) {
      const savedCards = window.localStorage.getItem('cards');
      return savedCards ? JSON.parse(savedCards) : [];
    }
    return [];
  }

  private saveCards(cards: Card[]): void {
    if (this.isBrowser()) {
      window.localStorage.setItem('cards', JSON.stringify(cards));
    }
  }

  addCard(card: Card): void {
    const currentCards = this.cardsSubject.value;
    const newId =
      currentCards.length > 0
        ? Math.max(...currentCards.map((c) => c.id || 0)) + 1
        : 1;
    const newCard = { ...card, id: newId, name: card.name || `Carte ${newId}` };
    currentCards.push(newCard);
    this.saveCards(currentCards);
  }

  deleteCard(card: Card): void {
    const currentCards = this.cardsSubject.value.filter(
      (c) => c.cardNumber !== card.cardNumber
    );
    this.saveCards(currentCards);
  }

  updateCard(updatedCard: Card): void {
    const currentCards = this.cardsSubject.value;
    const updatedCards = currentCards.map((c) =>
      c.id === updatedCard.id ? updatedCard : c
    );

    this.saveCards(updatedCards);
    this.cardsSubject.next(updatedCards);
  }

  getCards(): Card[] {
    return this.cardsSubject.value;
  }

  setEditingCard(card: Card): void {
    this.editingCardSubject.next(card);
  }

  getEditingCard(): Card | null {
    return this.editingCardSubject.value;
  }
}
