import { Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { ToasterComponent } from '../toaster/toaster.component';
@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {
  restoreForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
  constructor(public dialogRef: MatDialogRef<RestorePasswordComponent>, private auth: AuthService, private toast: MatSnackBar, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  restore() {
    if (this.restoreForm.valid) {
      this.auth.restorePassword(this.emailField.value).then(()=> {
        this.toast.openFromComponent(ToasterComponent, {data: 'A restore email has been sent'});
        this.dialogRef.close()
      }).catch(e => {
        this.toast.openFromComponent(ToasterComponent, {data: e.message});
      });
    }
  }

  get emailField() {return this.restoreForm.get('email')}

}
