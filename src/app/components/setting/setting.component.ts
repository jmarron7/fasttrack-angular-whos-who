import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {

  @Input() name: string = ""
  @Input() label: string = ""
  @Input() amount: number = 0
  @Input() min: number = 0
  @Input() max: number = 4

  @Output() incrementSettingByName = new EventEmitter<string>()
  
  handleIncrement() {
    this.incrementSettingByName.emit()
  }

  @Output() decrementSettingByName = new EventEmitter<string>()

  handleDecrement() {
    this.decrementSettingByName.emit()
  }

  increment() {
    this.amount += 1
  }

  decrement() {
    this.amount -= 1
  }

}
