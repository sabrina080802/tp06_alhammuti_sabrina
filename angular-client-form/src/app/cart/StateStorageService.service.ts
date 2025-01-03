import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateStorageService {
  private storageKey = 'cartState';

  saveState(state: any): void {
    const stateString = JSON.stringify(state);
    window.localStorage.setItem(this.storageKey, stateString);
  }
  getState(): any {
    const stateString = window.localStorage.getItem(this.storageKey);
    return stateString ? JSON.parse(stateString) : null;
  }
  clearState(): any {
    window.localStorage.removeItem(this.storageKey);
  }
}
