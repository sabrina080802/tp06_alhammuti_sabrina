import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Card } from '../card.model';
import { CardService } from '../card.service';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.css',
})
export class CardFormComponent {
  cardForm: FormGroup;
  selectedCardId: number | null = null;

  constructor(private fb: FormBuilder, private cardService: CardService) {
    this.cardForm = this.fb.group({
      cardName: ['', [Validators.required, Validators.maxLength(100)]],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{16}$')],
      ],
      ccv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      expiryMonth: [
        '',
        [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])$')],
      ],
      expiryYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    });
  }

  ngOnInit(): void {
    const editingCard = this.cardService.getEditingCard();
    if (editingCard) {
      this.cardForm.setValue({
        cardName: editingCard.name,
        cardNumber: editingCard.cardNumber,
        ccv: editingCard.ccv,
        expiryMonth: editingCard.expiryMonth,
        expiryYear: editingCard.expiryYear,
      });
      this.selectedCardId = editingCard.id;
    }
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      const cardData: Card = this.cardForm.value;
      if (this.selectedCardId) {
        cardData.id = this.selectedCardId;
        this.cardService.updateCard(cardData);
      } else {
        this.cardService.addCard(cardData);
      }

      this.cardForm.reset();
    } else {
      alert('Veuillez corriger les erreurs avant de soumettre.');
    }
  }
}
