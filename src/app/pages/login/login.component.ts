import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userName: FormControl= new FormControl('', [Validators.required, Validators.minLength(6)])
  password: FormControl= new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9]+$/)])

  router = inject(Router)
  onLogin = () => {
    if(this.userName.value == 'ashish' && this.password.value == '12345678'){
      this.router.navigateByUrl("dashboard")
    }else{
      alert('wrong password');
    }
  }

}
