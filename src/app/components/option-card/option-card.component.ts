import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-option-card',
  templateUrl: './option-card.component.html',
  styleUrls: ['./option-card.component.css']
})
export class OptionCardComponent implements OnInit {

  @Input() artistName: string = "Placeholder"
  @Input() picUrl: string = ""

  @Output() chooseSelectedOption = new EventEmitter<string>()
  
  handleChoose() {
    console.log("clicked on "+ this.artistName)
    this.chooseSelectedOption.emit()
  }


  constructor() { }

  ngOnInit(): void {
  }

}
