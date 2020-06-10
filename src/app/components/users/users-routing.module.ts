import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { UserResolverService } from 'src/app/intefaces/user-resolver.service';

const routes: Routes = [{ path: '', component: UsersComponent, resolve : {users : UserResolverService} }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
