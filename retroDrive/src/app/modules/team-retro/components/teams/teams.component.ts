import { Component, OnInit } from '@angular/core';
import { UserWorkspace } from 'src/app/models/userWorkspace';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreateNewTeamBottomsheetComponent } from '../create-new-team-bottomsheet/create-new-team-bottomsheet.component';
import { Workspace } from 'src/app/models/workspace';
import { FirestoreRetroBoardService } from '../../services/firestore-retro-board.service';
import { Team } from 'src/app/models/team';
import { JoinToExistingTeamDialogComponent } from '../join-to-existing-team-dialog/join-to-existing-team-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { UserTeams } from 'src/app/models/userTeams';
import { UserTeamsToSave } from 'src/app/models/userTeamsToSave';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  userWorkspace: UserWorkspace;
  currentWorkspace: Workspace;
  currentUser: User;

  constructor(
    private localStorageService: LocalStorageService,
    private bottomSheetRef: MatBottomSheet,
    private firestoreService: FirestoreRetroBoardService,
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService) { }

  teams: Team[];

  ngOnInit() {
    this.currentUser = this.localStorageService.getItem('currentUser');

    if (this.currentUser === undefined) {
      this.authService.signOut();
    } else {
      if (!this.currentUser.isNewUser) {
        this.userWorkspace = this.localStorageService.getItem('userWorkspace');
        this.currentWorkspace = this.userWorkspace.workspaces.find(uw => uw.isCurrent).workspaceRef;
      } else {
        this.router.navigate(['/']);
      }
    }


    this.prepareTeamsForCurrentWorkspace();
  }

  prepareTeamsForCurrentWorkspace() {
    this.firestoreService.findUserTeamsSnapshotChanges(this.currentUser.uid).subscribe(userTeamsSnapshot => {
      this.teams = new Array<Team>();
      userTeamsSnapshot.forEach(userTeamSnapshot => {
        const userTeams = userTeamSnapshot.payload.doc.data() as UserTeamsToSave;
        userTeams.teams.forEach(teamRef => {
          teamRef.get().then(teamDoc => {
            const findedUserTeam = teamDoc.data();
            findedUserTeam.id = teamDoc.id as string;
            findedUserTeam.workspace.get().then(workspaceSnapshot => {
              const userTeamToAdd = findedUserTeam as Team;
              const findedWorkspace = workspaceSnapshot.data() as Workspace;
              findedWorkspace.id = workspaceSnapshot.id;
              userTeamToAdd.workspace = findedWorkspace;

              if (findedWorkspace.id === this.currentWorkspace.id) {
                this.teams.push(findedUserTeam);
              }
            });
          });
        });

      });
    });
  }

  createNewTeamBottomShet() {
    const bottomSheetRef = this.bottomSheetRef.open(CreateNewTeamBottomsheetComponent, {
      data: {
        currentWorkspace: this.currentWorkspace,
        currentUser: this.currentUser
      }
    });

    bottomSheetRef.afterDismissed().subscribe(() => {});
  }

  jointToExisitngTeamDialog() {
    const dialogRef = this.dialog.open(JoinToExistingTeamDialogComponent, {
      width: '600px',
      data: {
        currentWorkspace: this.currentWorkspace,
        currentUser: this.currentUser
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      }
    });
  }
}
