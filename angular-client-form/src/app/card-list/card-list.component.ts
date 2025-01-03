import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService } from '../card.service';
import { Card } from '../card.model';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css'],
})
export class CardListComponent implements OnInit, OnDestroy {
  cards: Card[] = [];
  private cardSubscription: Subscription | null = null;
  cardForm: FormGroup;
  selectedCardId: number | null = null;
  editingCard: boolean = false;

  constructor(private cardService: CardService, private fb: FormBuilder) {
    this.cardForm = this.fb.group({
      cardName: [''],
      cardNumber: [''],
      ccv: [''],
      expiryMonth: [''],
      expiryYear: [''],
    });
  }

  ngOnInit(): void {
    this.cardSubscription = this.cardService.cards$.subscribe((cards) => {
      this.cards = cards;
      console.log('Cards received in the component:', cards); // Vérification de la réception des cartes
    });
  }

  ngOnDestroy(): void {
    if (this.cardSubscription) {
      this.cardSubscription.unsubscribe();
    }
  }

  onDelete(card: Card): void {
    this.cardService.deleteCard(card);
  }

  onEdit(card: Card): void {
    this.cardForm.patchValue({
      cardName: card.name,
      cardNumber: card.cardNumber,
      ccv: card.ccv,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
    });

    this.selectedCardId = card.id;
    this.editingCard = true;
  }

  onSubmit(): void {
    if (this.cardForm.valid && this.selectedCardId !== null) {
      const updatedCard: Card = {
        id: this.selectedCardId,
        name: this.cardForm.value.cardName,
        cardNumber: this.cardForm.value.cardNumber,
        ccv: this.cardForm.value.ccv,
        expiryMonth: this.cardForm.value.expiryMonth,
        expiryYear: this.cardForm.value.expiryYear,
      };

      this.cardService.updateCard(updatedCard);

      this.cardForm.reset();
      this.selectedCardId = null;
      this.editingCard = false;
    }
  }

  onCancel(): void {
    this.editingCard = false;
    this.selectedCardId = null;
    this.cardForm.reset();
  }
}
