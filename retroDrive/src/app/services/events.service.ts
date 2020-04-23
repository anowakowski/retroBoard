import { Injectable, EventEmitter } from '@angular/core';
import { TimerOption } from '../models/timerOption';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

constructor() { }

  private stopRetroInProgressProcessEmiter: EventEmitter<boolean> = new EventEmitter();
  private timerOptionsEmiter: EventEmitter<TimerOption> = new EventEmitter();
  private stopTimerEmiter: EventEmitter<boolean> = new EventEmitter();

  emitStopRetroInProgressProcessEmiter(shouldStopRetroProcess) {
    this.stopRetroInProgressProcessEmiter.emit(shouldStopRetroProcess);
  }

  getStopRetroInProgressProcessEmiter() {
    return this.stopRetroInProgressProcessEmiter;
  }

  emitTimerOptions(timerOption: TimerOption) {
    this.timerOptionsEmiter.emit(timerOption);
  }

  getTimerOptionsEmiter() {
    return this.timerOptionsEmiter;
  }

  emitStopTimer(shouldStopTimer) {
    this.stopTimerEmiter.emit(shouldStopTimer);
  }

  getStopTimerEmiter() {
    return this.stopTimerEmiter;
  }
}

