import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-guest-counter',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './guest-counter.html',
  styleUrls: ['./guest-counter.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestCounter {
    
  // Recibimos el número de huéspedes desde el componente padre para mostrarlo inicialmente
  @Input() guests: number = 1;

  // Emitimos un evento cuando cambia el número de huéspedes para actualizar al padre
  @Output() guestsChange = new EventEmitter<number>();

  increment() {
    this.guests++;
    this.guestsChange.emit(this.guests);
  }

  decrement() {
    if (this.guests > 1) {
      this.guests--;
      this.guestsChange.emit(this.guests);
    }
  }

  onInput(value: string) {
    const val = Number(value);
    if (!isNaN(val) && val >= 1) {
      this.guests = val;
      this.guestsChange.emit(this.guests);
    }
  }
}



