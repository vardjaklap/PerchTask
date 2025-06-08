import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { Shell } from '@app/shell/shell.service';
import { TaskListComponent } from '@app/task-list/task-list.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, data: { title: 'Home' } },
    { path: 'tasks', component: TaskListComponent, data: { title: 'tasks' } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule { }
