import { Component, OnInit, Inject } from '@angular/core';
import {Validators, FormBuilder, FormGroup, AbstractControl} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ToasterComponent } from '../toaster/toaster.component';
import { MatDialog } from '@angular/material/dialog';
import { RestorePasswordComponent } from '../restore-password/restore-password.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  constructor(private fb: FormBuilder, private auth: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  get formEmail(): AbstractControl | null {
    return this.loginForm.get('email');
  }
  get formPassword(): AbstractControl | null  { return this.loginForm.get('password'); }

  async signInWithGoogle(): Promise<void> {
    try {
      await this.auth.loginWithGoogle();
    } catch (e) {
      this.snackBar.openFromComponent(ToasterComponent, {data: e.message});
    }
  }

  async login(): Promise<void> {
    if (this.loginForm.valid) {
      try {
        await this.auth.loginWithEmail(this.loginForm.get('email').value, this.loginForm.get('password').value);
      } catch (e) {
        this.snackBar.openFromComponent(ToasterComponent, {data: e.message});
      }
    }
  }

  restorePassword(): void {
    // open popup here 
    const dialogRef = this.dialog.open(RestorePasswordComponent, {
      width: '450px'
    });
   // this.auth.restorePassword()
    // this.router.navigate([])
  }

}
