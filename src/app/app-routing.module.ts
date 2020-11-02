import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmitComponent } from './submit/submit.component';
import { DoneComponent } from './done/done.component';


const routes: Routes = [
  {
    path: 'submit',
    component: SubmitComponent,
    data: { title: 'Submit' }
  },
  {
    path: 'done',
    component: DoneComponent,
    data: { title: 'Done' }
  },
  {
    path: '',
    redirectTo: '/submit',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
