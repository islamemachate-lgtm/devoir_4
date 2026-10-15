import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

export class Action {
  idAct!: number;
  nomAct!: string;
}

export class Acteur {
  idAct!: number;
  nomAct!: string;
  dateNaissance!: string;
  nationalite!: string;
  action!: Action;
}

@Component({
  selector: 'app-acteurs',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container mt-4">
      <h5 class="mb-3">Liste de Acteurs</h5>

      <table class="table table-striped">
        <thead>
          <tr>
            <th>N°</th>
            <th>Nom</th>
            <th>Date de naissance</th>
            <th>Nationalité</th>
            <th>Action</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (a of acteurs(); track a.idAct; let i = $index) {
            <tr>
              <td>{{ i + 1 }}</td>
              <td>{{ a.nomAct }}</td>
              <td>{{ a.dateNaissance }}</td>
              <td>{{ a.nationalite }}</td>
              <td>{{ a.action.nomAct }}</td>
              <td>
                <button class="btn btn-danger btn-sm me-2" (click)="supprimer(a.idAct)">Supprimer</button>
                <button class="btn btn-success btn-sm" (click)="modifier(a)">Modifier</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <div class="card p-3 mt-4" style="max-width: 600px;">
        <h5>Ajouter un Acteur</h5>
        <input class="form-control mb-2" [(ngModel)]="nouveau.nomAct" placeholder="Nom" />
        <input class="form-control mb-2" [(ngModel)]="nouveau.dateNaissance" placeholder="Date de naissance" />
        <input class="form-control mb-2" [(ngModel)]="nouveau.nationalite" placeholder="Nationalité" />
        <select class="form-control mb-2" [(ngModel)]="nouveau.actionId">
          <option [ngValue]="0">-- Choisir Action --</option>
          @for (ac of actions; track ac.idAct) {
            <option [ngValue]="ac.idAct">{{ ac.nomAct }}</option>
          }
        </select>
        <button class="btn btn-primary" (click)="ajouter()">Ajouter</button>
      </div>

      @if (modeEdition) {
        <div class="card p-3 mt-3" style="max-width: 600px;">
          <h5>Modifier Acteur</h5>
          <input class="form-control mb-2" [(ngModel)]="acteurEnCours.nomAct" placeholder="Nom" />
          <input class="form-control mb-2" [(ngModel)]="acteurEnCours.dateNaissance" placeholder="Date" />
          <input class="form-control mb-2" [(ngModel)]="acteurEnCours.nationalite" placeholder="Nationalité" />
          <select class="form-control mb-2" [(ngModel)]="acteurEnCours.actionId">
            @for (ac of actions; track ac.idAct) {
              <option [ngValue]="ac.idAct">{{ ac.nomAct }}</option>
            }
          </select>
          <button class="btn btn-primary" (click)="valider()">Valider</button>
        </div>
      }
    </div>
  `,
})
export class ActeursComponent {
  actions: Action[] = [
    { idAct: 1, nomAct: 'Action' },
    { idAct: 2, nomAct: 'Comédie' },
    { idAct: 3, nomAct: 'Drame' },
  ];

  acteurs = signal<Acteur[]>([
    {
      idAct: 1,
      nomAct: 'Tom Hanks',
      dateNaissance: '09/07/1956',
      nationalite: 'Américaine',
      action: this.actions[0],
    },
    {
      idAct: 2,
      nomAct: 'Leonardo DiCaprio',
      dateNaissance: '11/11/1974',
      nationalite: 'Américaine',
      action: this.actions[2],
    },
    {
      idAct: 3,
      nomAct: 'Brad Pitt',
      dateNaissance: '18/12/1963',
      nationalite: 'Américaine',
      action: this.actions[1],
    },
  ]);

  nouveau: any = {
    nomAct: '',
    dateNaissance: '',
    nationalite: '',
    actionId: 0,
  };
  modeEdition = false;
  acteurEnCours: any = {};

  ajouter() {
    if (!this.nouveau.nomAct || this.nouveau.actionId === 0) return;
    const id = Math.max(...this.acteurs().map((a) => a.idAct)) + 1;
    const action = this.actions.find(
      (ac) => ac.idAct === this.nouveau.actionId
    )!;
    this.acteurs.set([
      ...this.acteurs(),
      {
        idAct: id,
        nomAct: this.nouveau.nomAct,
        dateNaissance: this.nouveau.dateNaissance,
        nationalite: this.nouveau.nationalite,
        action: action,
      },
    ]);
    this.nouveau = {
      nomAct: '',
      dateNaissance: '',
      nationalite: '',
      actionId: 0,
    };
  }

  supprimer(id: number) {
    this.acteurs.set(this.acteurs().filter((a) => a.idAct !== id));
  }

  modifier(a: Acteur) {
    this.acteurEnCours = { ...a, actionId: a.action.idAct };
    this.modeEdition = true;
  }

  valider() {
    const action = this.actions.find(
      (ac) => ac.idAct === this.acteurEnCours.actionId
    )!;
    this.acteurs.set(
      this.acteurs().map((a) =>
        a.idAct === this.acteurEnCours.idAct
          ? { ...this.acteurEnCours, action }
          : a
      )
    );
    this.modeEdition = false;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ActeursComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" href="#">Gestion Acteurs</a>
        <div class="navbar-nav">
          <a class="nav-link" href="#">Home</a>
          <a class="nav-link active" href="#">Acteurs ▾</a>
        </div>
        <span class="navbar-text text-white ms-auto">[username] ▾</span>
      </div>
    </nav>
    <app-acteurs></app-acteurs>
  `,
})
export class App {}

bootstrapApplication(App);
