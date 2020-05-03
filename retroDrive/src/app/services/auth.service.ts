import { Injectable } from '@angular/core';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of, merge } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';

import { Router } from '@angular/router';

import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;
  authState: any;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
    ) {
      this.user$ = afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      );

      afAuth.authState.subscribe((authState) => {
        this.authState = authState;
      });
  }

  get authenticated(): boolean {
    // return this.user$ !== null;
    return this.authState !== null;
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    return await this.afAuth.auth.signInWithPopup(provider);
  }

  async facebookSignin() {
    const provider = new auth.FacebookAuthProvider();
    return await this.afAuth.auth.signInWithPopup(provider);
  }

  async emailSigUp(email: string, password: string) {
    return await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  async emailSigIn(email: string, password: string) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async userState() {
    const user = await this.isLoggedIn();
    if (user) {
      return !user.uid;
    } else {
      return false;
   }
 }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
      location.reload();
    });
  }

/*
  async signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }
  */
}
