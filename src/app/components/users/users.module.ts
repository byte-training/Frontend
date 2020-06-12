import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent, createDialog, readDialog, updateDialog, deleteDialog } from './users.component';
import { MaterialModule } from 'src/app/material';
//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { DataListPipe } from 'src/app/pipes/data-list.pipe';

@NgModule({
  declarations: [
    UsersComponent,
    createDialog,
    readDialog,
    updateDialog,
    deleteDialog,
    DataListPipe
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    })
  ]
})
export class UsersModule { }
