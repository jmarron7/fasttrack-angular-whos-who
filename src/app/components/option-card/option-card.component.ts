import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-option-card',
  templateUrl: './option-card.component.html',
  styleUrls: ['./option-card.component.css']
})
export class OptionCardComponent implements OnInit {

  @Input() artistName: string = "Placeholder"
  @Input() picUrl: string = ""
  @Input() hasChosen: boolean = false;

  @Output() chooseSelectedOption = new EventEmitter<string>()
  
  handleChoose() {
    this.chooseSelectedOption.emit()
  }

  constructor() { }

  ngOnInit(): void {
  }

}
