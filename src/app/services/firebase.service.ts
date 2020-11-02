import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import {User} from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) { }

  async createUser(user: User): Promise<void> {
    try {
      await this.afs.doc(`users/${user.uid}`).set(user);
    } catch (e) {
      console.error(e);
    }
  }

  async updateUserInfo(user: User): Promise<void> {
    try {
      await this.afs.doc(`users/${user.uid}`).update(user);
    } catch (e) {
      console.error(e);
    }
  }

  getUser(uid: string): Observable<User> {
    return this.afs.doc<User>(`users/${uid}`).valueChanges();
  }

  uploadImage(file): AngularFireUploadTask {
    const filePath = 'myfilename';
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    return task;
  }

}
