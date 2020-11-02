import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {auth} from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import {Observable, of, from} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {User} from '../models/user.model';
import { FirebaseService } from './firebase.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  constructor(private afAuth: AngularFireAuth, private router: Router, private fireService: FirebaseService, private afs: AngularFirestore) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }

   async loginWithGoogle(): Promise<void> {
      const credential = await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
      return this.updateUserData(credential.user);
  }

  async loginWithEmail(email: string, password: string): Promise<auth.UserCredential> {
     return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async registerUser(email: string, password: string): Promise<firebase.User> {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return credential.user;
    } catch (e) {
      console.error(e);
    }
  }

  async signOut(): Promise<boolean> {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData({uid, email, displayName, photoURL}: User): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);
    const data = {
      uid,
      email,
      displayName,
      photoURL
    };
    return userRef.set(data, {merge: true});
  }

  async getCurrentUser(): Promise<User> {
    return this.afAuth.currentUser;
  }


  async restorePassword(email: string): Promise<void> {
   return this.afAuth.sendPasswordResetEmail(email);
  }

}
