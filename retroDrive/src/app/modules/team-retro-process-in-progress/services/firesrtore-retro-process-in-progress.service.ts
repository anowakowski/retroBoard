import { Injectable } from '@angular/core';
import { FirestoreBaseService } from 'src/app/services/firestore-base.service';
import { ConditionQueryData } from 'src/app/helpers/conditionQueryData';
import { TimerOption } from 'src/app/models/timerOption';

@Injectable({
  providedIn: 'root'
})
export class FiresrtoreRetroProcessInProgressService {
  constructor(private firestoreBase: FirestoreBaseService) { }

  addNewRetroBoardCard(newRetroBoardCard) {
    return this.firestoreBase.addNewItem('/retroBoardCards/', newRetroBoardCard);
  }

  addNewRetroBoardCardAction(newRetroBoardCardAction) {
    return this.firestoreBase.addNewItem('/retroBoardCardActions/', newRetroBoardCardAction);
  }

  addNewTimerOptions(timerOption: TimerOption) {
    this.firestoreBase.addNewItem('/timerOptions/', timerOption);
  }

  updateRetroBoardCardAction(action: any, id: string) {
    this.firestoreBase.updateItem('/retroBoardCardActions/', id, action);
  }

  deleteRetroBoardCardAction(actionId) {
    this.firestoreBase.deleteItem('/retroBoardCardActions/', actionId);
  }

  updateRetroBoardCard(cardToUpdate: any, id: string) {
    this.firestoreBase.updateItem('/retroBoardCards/', id, cardToUpdate);
  }

  findRetroBoardByUrlParamId(urlParamId: string) {
    const condition: ConditionQueryData = {
      fieldName: 'urlParamId',
      conditionOperator: '==',
      value: urlParamId
    };

    return this.firestoreBase.getFiltered('/retroBoards/', condition);
  }

  findRetroBoardByUrlParamIdSnapshotChanges(urlParamId: string) {
    const condition: ConditionQueryData = {
      fieldName: 'urlParamId',
      conditionOperator: '==',
      value: urlParamId
    };

    return this.firestoreBase.getFilteredSnapshotChanges('/retroBoards/', condition);
  }

  findRetroBoardCardById(docId: string) {
    return this.firestoreBase.getFilteredById('/retroBoardCards/', docId);
  }

  getAllTimerOptions() {
    return this.firestoreBase.getAll('/timerOptions/');
  }

  addRetroBoardAsRef(retroBoardId: string) {
    return this.firestoreBase.addAsRef('/retroBoards/', retroBoardId);
  }

  addUserAsRef(uid: string) {
    return this.firestoreBase.addAsRef('/users/', uid);
  }

  addRetroBoardCardActionAsRef(actionId: string) {
    return this.firestoreBase.addAsRef('/retroBoardCardActions/', actionId);
  }

  addWorkspaceAsRef(workspaceId: string) {
    return this.firestoreBase.addAsRef('/workspaces/', workspaceId);
  }

  retroBoardCardsFilteredSnapshotChanges() {
    return this.firestoreBase.snapshotChanges('/retroBoardCards/');
  }

  findRetroBoardByIdSnapshotChanges(id: string) {
    return this.firestoreBase.getFilteredByIdSnapshotChanges('retroBoards', id);
  }

  removeRetroBoardCard(id: string) {
    this.firestoreBase.deleteItem('/retroBoardCards/', id);
  }
}
