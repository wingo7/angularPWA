import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {Gender} from '../models/gender.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput; 
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  user: User;
  genders: Gender[] = [{value: 'male', viewValue: 'Male'}, {value: 'female', viewValue: 'Female'}, {value: 'not set', viewValue: 'Not selected'}];
  editable = false;
  constructor(public auth: AuthService, public afs: FirebaseService) {
   
  }

  ngOnInit(): void {
    this.getUser();
  }

  edit() {
    this.editable = !this.editable;
  }

  async getUser(): Promise<void> {
    try {
      const uid = await (await this.auth.getCurrentUser()).uid;
      this.afs.getUser(uid).subscribe(data => {
        this.user = data;
      });
    } catch (e) {
      console.log(e);
    }
  }

  changeImg(): void {
    const file = this.fileInput.nativeElement.files[0];
    const reference = this.afs.uploadImage(file);
    reference.getDownloadURL().subscribe(data => {
      this.user.photoURL = data;
    })
  }

  saveChanges(): void {
    console.log('savechanges');
    this.editable = false;
    this.afs.updateUserInfo(this.user);
  }

}
