import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

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

  changeImg() {
    // todo it works, finish the logic in the other components
    /*
    const file = this.fileInput.nativeElement.files[0];
    const task = this.afs.uploadImage(file);
    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    */
  }

}
