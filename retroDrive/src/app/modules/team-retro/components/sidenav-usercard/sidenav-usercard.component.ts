import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserWorkspace } from 'src/app/models/userWorkspace';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-sidenav-usercard',
  templateUrl: './sidenav-usercard.component.html',
  styleUrls: ['./sidenav-usercard.component.css']
})
export class SidenavUsercardComponent implements OnInit, OnDestroy {

  mainPhotoUrl = 'https://robohash.org/PC4.png?set=set2';
  currentUser: User;
  public userWorkspace: UserWorkspace;
  public currentUserWorkspaceName: string;
  setCurrentWorkspaceSubscriptions: any;

  constructor(
    private localStorageService: LocalStorageService,
    public authService: AuthService,
    private eventsService: EventsService) { }


  ngOnInit() {
    this.currentUser = this.localStorageService.getDecryptedItem(this.localStorageService.currentUserKey);

    if (this.currentUser === undefined) {
      this.authService.signOut();
    } else {
      if (!this.currentUser.isNewUser) {
        this.userWorkspace = this.localStorageService.getDecryptedItem(this.localStorageService.userWorkspaceKey);
        const currentWorkspace = this.userWorkspace.workspaces.find(uw => uw.isCurrent).workspace;
        this.currentUserWorkspaceName = currentWorkspace.name;
      }
    }

    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.setCurrentWorkspaceSubscriptions.unsubscribe();
  }


  private subscribeEvents() {
    this.setCurrentWorkspaceSubscriptions =
      this.eventsService.getSetNewCurrentWorkspaceEmiterEmiter().subscribe(currentWorkspace => {
        this.currentUserWorkspaceName = currentWorkspace.name;
      });
  }

}
