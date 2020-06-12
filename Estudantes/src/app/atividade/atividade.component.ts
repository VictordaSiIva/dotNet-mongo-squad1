import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Atividade } from '../Shared/atividade.interfaces';
import { AtividadeService } from '../services/atividades/atividade.service';

@Component({
  selector: 'app-atividade',
  templateUrl: './atividade.component.html',
  styleUrls: ['./atividade.component.css',
   '../../dist/css/adminlte.min.css',
  '../../plugins/fontawesome-free/css/all.min.css']
})
export class AtividadeComponent implements OnInit {

  private ngGetActivityUnsubscribe = new Subject();

  atividadeForm: FormGroup;

  atividade: Atividade = {
    id: '',
    nome: '',
    descricao: ''

  };

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: AtividadeService) { }

  ngOnInit(): void {

    this.atividadeForm = new FormGroup({
      nome: new FormControl(null),
      descricao: new FormControl(null)
    });

    const id = this.route.snapshot.params['id'];

    if(id)
    {
      this.getActivity(id)
    }

  }


  getActivity(id: string) {
    this.service.getActivity(id)
      .pipe(takeUntil(this.ngGetActivityUnsubscribe))
      .subscribe(response => {
        const data = response;
        this.atividade = JSON.parse(JSON.stringify(data))

        this.atividadeForm.controls['nome'].setValue(this.atividade.nome)
        this.atividadeForm.controls['descricao'].setValue(this.atividade.descricao)

      }, err => {

      });
  }

  save() {

    if (!this.atividade.id) {
      this.atividade = Object.assign({}, {
        id:'',
        nome: this.atividadeForm.get('nome').value,
        descricao: this.atividadeForm.get('descricao').value
      });
    } else {
      this.atividade.nome = this.atividadeForm.get('nome').value;
      this.atividade.descricao =  this.atividadeForm.get('descricao').value;

    }


    this.service.save(this.atividade)
      .pipe(takeUntil(this.ngGetActivityUnsubscribe))
      .subscribe(_ => {


      }, err => {
      });

      this.router.navigateByUrl('/atividades').then(e => {
        if (e) {
          console.log("Navigation is successful!");
        } else {
          console.log("Navigation has failed!");
        }
      });
  }
}

