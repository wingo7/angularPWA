import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseService} from '../services/firebase.service';
import {User} from '../models/user.model';
import { AuthService } from '../services/auth.service';
import {Gender} from '../models/gender.model';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  hide = true;
  gender = 'not set';
  genders: Gender[] = [{value: 'male', viewValue: 'Male'}, {value: 'female', viewValue: 'Female'}, {value: 'not set', viewValue: 'Not selected'}]
  constructor(private fb: FormBuilder, private afs: FirebaseService, private auth: AuthService) {

  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: [''],
      age: [''],
      gender: [''],
      photoURL: ['../../assets/images/profile.png']
    });
  }

  get formEmail(): AbstractControl | null  {
    return this.registerForm.get('email');
  }
  get formPassword(): AbstractControl | null { return this.registerForm.get('password'); }

  async registerUser(): Promise<void> {
    const formValue = this.registerForm.value;
    if (this.registerForm.valid) {
      const user = await this.auth.registerUser(formValue.email, formValue.password);
      formValue.uid = user.uid;
      this.afs.createUser(formValue);
    }
  }


}
