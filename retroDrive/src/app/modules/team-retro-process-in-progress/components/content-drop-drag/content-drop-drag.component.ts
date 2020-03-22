import { Component, OnInit, Pipe} from '@angular/core';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Board } from 'src/app/models/board';
import { Column } from 'src/app/models/column';
import { RetroBoardCard } from 'src/app/models/retroBoardCard';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

const WENT_WELL = 'Went Well';
const TO_IMPROVE = 'To Improve';
@Component({
  selector: 'app-content-drop-drag',
  templateUrl: './content-drop-drag.component.html',
  styleUrls: ['./content-drop-drag.component.scss']
})
export class ContentDropDragComponent implements OnInit {

  addNewRetroBoardCardForm: FormGroup;
  newCardContentFormControl = new FormControl('', Validators.required);

  constructor(private formBuilder: FormBuilder) {}

  private wnetWellRetroBoardCol = new Column(WENT_WELL, [
    new RetroBoardCard('Get to work', false, 1),
    new RetroBoardCard('Get to work', false, 2),
    new RetroBoardCard('Get to work', false, 3),
    new RetroBoardCard('Get to work', false, 4),
  ]);
  private toImproveRetroBoardCol = new Column(TO_IMPROVE, [
    new RetroBoardCard('Get to work', false, 1),
    new RetroBoardCard('Get to work', false, 2),
    new RetroBoardCard('Get to work', false, 3),
  ]);

  public shouldStopTimer = false;

  board: Board = new Board('Test Board', [
    this.wnetWellRetroBoardCol,
    this.toImproveRetroBoardCol
  ]);

  ngOnInit() {
    this.createAddNewRetroBoardCardForm();
  }

  createAddNewRetroBoardCardForm() {
    this.addNewRetroBoardCardForm = this.formBuilder.group({
      newCardContentFormControl: this.newCardContentFormControl
    });
  }

  stopTimer() {
    this.shouldStopTimer = true;
  }

  addNewCardToColumn(colName: string) {
    if (colName === WENT_WELL) {
      const maxIndexOfElementInArray = Math.max.apply(Math, this.wnetWellRetroBoardCol.retroBoardCards.map(x => x.index));
      const incrementIndex = maxIndexOfElementInArray + 1;
      const newItem = new RetroBoardCard('', true, incrementIndex);
      newItem.isNewItem = true;
      this.wnetWellRetroBoardCol.retroBoardCards.push(newItem);
      this.wnetWellRetroBoardCol.retroBoardCards.sort((a, b ) => b.index - a.index);

    } else if (colName === TO_IMPROVE) {
      this.toImproveRetroBoardCol.retroBoardCards.push(new RetroBoardCard('', true, 5));
      this.toImproveRetroBoardCol.retroBoardCards.sort((a, b ) => b.index - a.index);
    }
  }

  saveRetroBoardCard(card: RetroBoardCard, colName: string) {
    if (this.addNewRetroBoardCardForm.valid) {
      const newCardContentFormControlValue = this.addNewRetroBoardCardForm.value.newCardContentFormControl;
      card.name = newCardContentFormControlValue;
      card.isNewItem = false;
      card.isEdit = false;
      const blankValueToSetFormControl = ' ';
      const index = this.getArrayIndex(card, this.wnetWellRetroBoardCol.retroBoardCards);
      this.updaRetroBoardCard(index, card, this.wnetWellRetroBoardCol.retroBoardCards);
      this.setNewCardContentFormControl(blankValueToSetFormControl);
    }
  }

  editCard(card: RetroBoardCard, colName: string) {
    if (!card.isNewItem) {
      if (card.isEdit){
        return;
      }
      if (card.isClickedFromCloseEdit) {
        const findedRetroBoardCard = this.getRetroBoardCard(card, this.wnetWellRetroBoardCol.retroBoardCards);
        const index = this.getArrayIndex(findedRetroBoardCard, this.wnetWellRetroBoardCol.retroBoardCards);
        findedRetroBoardCard.isClickedFromCloseEdit = false;
        this.updaRetroBoardCard(index, findedRetroBoardCard, this.wnetWellRetroBoardCol.retroBoardCards);
        return;
      }
      if (colName === WENT_WELL) {
        this.processRetroBoardCard(card, this.wnetWellRetroBoardCol.retroBoardCards);
      } else if (colName === TO_IMPROVE) {
        this.processRetroBoardCard(card, this.toImproveRetroBoardCol.retroBoardCards);
      }
    }
  }

  closeEditCard(card: RetroBoardCard, colName: string) {
    if (colName === WENT_WELL) {
      this.closeEditRetroBoardCardProcess(card, this.wnetWellRetroBoardCol.retroBoardCards);
    } else if (colName === TO_IMPROVE) {
      this.closeEditRetroBoardCardProcess(card, this.toImproveRetroBoardCol.retroBoardCards);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  setNewCardContentFormControl(value: string) {
    this.newCardContentFormControl.setValue(value);
  }

  private processRetroBoardCard(card: RetroBoardCard, retroBoardCards: Array<RetroBoardCard>) {
    const findedRetroBoardCard = this.getRetroBoardCard(card, retroBoardCards);
    const index = this.getArrayIndex(findedRetroBoardCard, retroBoardCards);
    findedRetroBoardCard.isEdit = true;
    this.updaRetroBoardCard(index, findedRetroBoardCard, retroBoardCards);
    this.setNewCardContentFormControl(card.name);
  }


  private closeEditRetroBoardCardProcess(card: RetroBoardCard, retroBoardCards: Array<RetroBoardCard>) {
    const findedRetroBoardCard = this.getRetroBoardCard(card, retroBoardCards);
    const index = this.getArrayIndex(findedRetroBoardCard, retroBoardCards);
    findedRetroBoardCard.isEdit = false;
    findedRetroBoardCard.isClickedFromCloseEdit = true;
    this.updaRetroBoardCard(index, findedRetroBoardCard, retroBoardCards);
  }

  private updaRetroBoardCard(index: number, retroBoardCardToUpdate: RetroBoardCard, retroBoardCards: Array<RetroBoardCard>) {
    retroBoardCards[index] = retroBoardCardToUpdate;
  }

  private getRetroBoardCard(card: RetroBoardCard, retroBoardCards: Array<RetroBoardCard>) {
    return retroBoardCards.find(x => x.index === card.index);
  }


  private getArrayIndex(findedRetroBoardCard: RetroBoardCard, array: any[]) {
    return array.indexOf(findedRetroBoardCard);
  }
}