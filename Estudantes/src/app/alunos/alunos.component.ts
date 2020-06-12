import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Aluno } from '../Shared/aluno.interfaces';
import { AlunoService } from '../services/alunos/aluno.service';

@Component({
  selector: 'app-alunos',
  templateUrl: './alunos.component.html',
  styleUrls: ['./alunos.component.css',
   '../../dist/css/adminlte.min.css',
  '../../plugins/fontawesome-free/css/all.min.css']
})
export class AlunosComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false }) datatableElementAluno: DataTableDirective;
  isDtInitialized = false;
  dtElementAluno: DataTableDirective;
  dtOptionsAluno: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 10,
    processing: true,
    language: {
      emptyTable: 'Nenhum registro encontrado',
      info: 'Mostrando de _START_ até _END_ de _TOTAL_ registros',
      infoEmpty: 'Mostrando 0 até 0 de 0 registros',
      infoFiltered: '(Filtrados de _MAX_ registros)',
      infoPostFix: '',
      lengthMenu: '_MENU_ resultados por página',
      loadingRecords: 'Carregando...',
      processing: 'Processando...',
      zeroRecords: 'Nenhum registro encontrado',
      search: 'Pesquisar',
      paginate: {
        next: 'Próximo',
        previous: 'Anterior',
        first: 'Primeiro',
        last: 'Último'
      },
      aria: {
        sortAscending: ': Ordenar colunas de forma ascendente',
        sortDescending: ': Ordenar colunas de forma descendente'
      }
    }
  };
  dtInstanceAluno: DataTables.Api;
  dtTriggerAluno = new Subject();

  alunos: Aluno[] = [];

  private ngAlunosUnsubscribe = new Subject();
  private ngDeleteAlunosUnsubscribe = new Subject();

  constructor(private router: Router,
    private service: AlunoService) { }

  ngOnInit(): void {
    this.search()
  }

  search() {


    this.service.getAlunos()
      .pipe(takeUntil(this.ngAlunosUnsubscribe))
      .subscribe(response => {
        const data = response;
        this.alunos = JSON.parse(JSON.stringify(data))  ;

        this.rerender();

      }, err => {

      });
  }



  ngAfterViewInit(): void {
    this.dtTriggerAluno.next();
  }

  confirmDelete(id: string) {
    const isDeleting = confirm('Você realmente deseja apagar esta atividade ?');
    if (!isDeleting) {
      return;
    }

    this.delete(id);
  }

  private delete(id: string) {


    this.service.delete(id)
      .subscribe(_ => {



      }, err => {

      });

      window.setTimeout(() => {

        this.rerender();
        this.search();
      },10);

  }


  rerender(): void {
    this.datatableElementAluno.dtInstance.then((dtInstance: DataTables.Api) => {
      //dtInstance.clear();
      // dtInstance.draw();
      dtInstance.destroy();
      this.dtTriggerAluno.next();


    });
  }

  ngOnDestroy(): void {
    this.dtTriggerAluno.unsubscribe();
    this.ngAlunosUnsubscribe.next();
    this.ngAlunosUnsubscribe.complete();
  }

}
