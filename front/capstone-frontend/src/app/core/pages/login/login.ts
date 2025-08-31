import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login-service/login-service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  username = '';
  password = '';
  passwordErrors: string[] = [];
  loginError: string | null = null;

  constructor(private router: Router, private loginService: LoginService) {}

  validatePassword(password: string): string[] {
    const errors = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push('Password must contain at least one number and one special character');
    return errors;
  }

  onSubmit(form: any) {
    this.passwordErrors = this.validatePassword(this.password);
    this.loginError = null;

    if (form.valid && this.passwordErrors.length === 0) {
      this.loginService.login(this.username, this.password).subscribe({
        next: () => this.router.navigate(['/home']),
        error: () => this.loginError = 'Credenciales inválidas'
      });
    } else {
      Object.values(form.controls).forEach((control: any) => control.markAsTouched());
    }
  }
}
