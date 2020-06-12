import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Professor, Login } from '../Shared/professor.interfaces';
import { ProfessorService } from '../services/professor/professor.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login:Login= {
    email:'',
    senha:''
  }

  loginForm: FormGroup;
  constructor(private router: Router,
    private professorService: ProfessorService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null),
      senha: new FormControl(null),

    });
  }

  fazerLogin() {

    this.login = Object.assign({}, {

      email: this.loginForm.get('email').value,
      senha: this.loginForm.get('senha').value,
    });

    this.professorService.fazerLogin(this.login)
      .subscribe(response => {
         const data = response;

      }, err => {

      });


  }

}