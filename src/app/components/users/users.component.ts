import { Component, OnInit, OnDestroy, Inject, ViewChild, Input, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/format-datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { empty, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { ToolbarComponent } from '../toolbar/toolbar.component';


export interface UserData {
  id: number;
  identification: string;
  name: string;
  lastname: string;
  birthdate: string;
}

var usuario: User;
var ids = 0;
var isLoadingResults = false;
var datos: User[];

var eliminadoResponsive: boolean = false;


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class UsersComponent implements OnInit, OnDestroy {

  public activeLang = ToolbarComponent.activeLang;

  public deviceXs: boolean;
  public mediaSub: Subscription;
  displayedColumns: string[] = ['id', 'name', 'lastname', 'birthdate', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  // Declare height and width variables
  scrHeight: any;
  scrWidth: any;
  users: any[];
  isLoadingResults = isLoadingResults;

  addUserResponsive: boolean = false;
  readUserResponsive: boolean = false;

  //responsive
  user: User;
  userSave: User;
  public status;
  showCarga = false;
  showMessage = false;
  message = "";

  fechaArray: any;
  fecha: any;
  date: any;

  editData: boolean = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UsersService,
    private translate: TranslateService,
    public mediaObserver: MediaObserver,
    private snackBar: MatSnackBar) {

    this.translate.setDefaultLang(this.activeLang);
    this.getScreenSize();
    this.user = new User(0, "", "", "", "");
  }

  //addResponsive
  changeView1() {
    this.user = new User(0, "", "", "", "");
    this.addUserResponsive = !this.addUserResponsive;
    this.showMessage = false;
  }

  changeView2(user) {
    this.readUserResponsive = !this.readUserResponsive;
    this.showMessage = false;
    this.fechaArray = user.birthdate.split('/');
    this.fecha = this.fechaArray[2] + '-' + this.fechaArray[1] + '-' + this.fechaArray[0];
    console.log(user)
    this.date = new Date(this.fecha);
    this.date.setHours(this.date.getHours() + 6);
    this.user = new User(user.id, user.identification, user.name, user.lastname, user.birthdate)
  }

  changeViewsClean() {
    this.addUserResponsive = false;
    this.readUserResponsive = false;
    this.editData = false;
    this.showMessage = false;
    this.user = new User(0, "", "", "", "");
  }

  changeEdit() {
    this.editData = !this.editData;
  }

  //Height and Width
  @HostListener('window:resize', ['$event'])

  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    console.log(this.scrHeight, this.scrWidth);
  }

  async ngOnInit() {
    this.activatedRoute.url
      .subscribe(url => console.log('The URL changed to: ' + url));

    this.activatedRoute.data.subscribe((data: { users: any }) => {
      this.users = data.users;
      console.log(this.users, 'Dataaa')
      this.dataSource = new MatTableDataSource(this.users);
      datos = this.users;
    });

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 100);

    this.mediaSub = await this.mediaObserver.media$.subscribe((result: MediaChange) => {
      console.log(result.mqAlias);
      this.deviceXs = result.mqAlias === 'xs' ? true : false;
      this.addUserResponsive = result.mqAlias === 'xs' ? false : false;
      this.readUserResponsive = result.mqAlias === 'xs' ? false : false;
      this.editData = result.mqAlias === 'xs' ? false : false;
      if (!this.deviceXs) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })

  }

  ngOnDestroy() {
    this.mediaSub.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  //Get Data
  getUsers() {
    this._userService.getUsers().pipe(
      catchError((error) => {
        return empty();
      })
    ).subscribe((data) => {
      this.users = data;
      console.log(this.users, 'Dataaa')
      isLoadingResults = false;
      datos = this.users;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  //Create Dialog
  createDialog(): void {
    const dialogRef = this.dialog.open(createDialog, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log('The dialog was closed');
      console.log(result, 'Resultado de ingreso');
      this.getUsers();

    });
  }

  //Read Dialog
  readDialog(data): void {
    const dialogRef = this.dialog.open(readDialog, {
      width: '600px',
      data
    })
    console.log(data)
  }

  //Update Dialog
  updateDialog(data): void {
    console.log(data, '----------')
    usuario = data;
    const dialogRef = this.dialog.open(updateDialog, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log('The dialog was closed');
      console.log(result, 'Resultado de ingreso');

      this.getUsers();

    });
  }

  //Delete Dialog
  deleteDialog(data): void {
    const dialogRef = this.dialog.open(deleteDialog, {
      width: '600px',
      data
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log('The dialog was closed');
      console.log(result, 'Resultado de ingreso');
      if (eliminadoResponsive || result == 'eliminado') {
        this.changeViewsClean()
        eliminadoResponsive = false;
      }

      this.getUsers();

    });
  }

  //RESPONSIVE
  createUser() {
    console.log(this.user, 'esto agrega')
    if (this.user.identification == '' || this.user.identification == null || this.user.name == '' || this.user.name == null ||
      this.user.lastname == '' || this.user.lastname == null || this.user.birthdate == '' || this.user.birthdate == null) {
      this.message = "Ingrese todos los campos.";
      this.showMessage = true;
    } else {
      let dataEncontrada = datos.filter(item => item.identification == this.user.identification);

      if (dataEncontrada.length > 0) {
        this.message = "La identificación ya existe.";
        this.showMessage = true;

      } else {
        ids += 1;
        this.showMessage = false;
        this.userSave = new User(ids, this.user.identification, this.user.name, this.user.lastname, convert(this.user.birthdate));

        console.log(this.userSave, 'Todo')

        this.showCarga = true;

        this._userService.createUser(this.userSave).subscribe(
          response => {
            this.showCarga = false;

            console.log(response, 'RESPONSE')
            if (response) {
              this.status = 'ok';
              if (response.response == 'Created') {
                this.changeView1();
                this.getUsers();
                this.user = new User(0, "", "", "", "");
                isLoadingResults = true;

                this.snackBar.open(response.message, "", {
                  panelClass: ['colorBueno'],
                  duration: 2100, horizontalPosition: 'end',
                });
              } else {
                this.snackBar.open(response.message, "", {
                  panelClass: ['colorError'],
                  duration: 3100, horizontalPosition: 'end'
                });
              }
            }
          },
          error => {
            this.showCarga = false;

            if (error) {
              console.log(<any>error);
              this.status = 'error';
              this.snackBar.open("Error al crear al usuario!", "", {
                panelClass: ['colorError'],
                duration: 3100, horizontalPosition: 'end'
              });
            }
          }
        )
      }


    }

  }

  //------------------ UPDATE RESPOSIVE
  async updateUser() {
    if (this.user.identification == '' || this.user.identification == null || this.user.name == '' || this.user.name == null ||
      this.user.lastname == '' || this.user.lastname == null || this.date == null) {
      this.message = "Ingrese todos los campos.";
      this.showMessage = true;
    } else {
      let dataEncontrada = datos.filter(item => item.identification == this.user.identification && item.id != this.user.id);

      if (dataEncontrada.length > 0) {
        this.message = "La identificación ya existe.";
        this.showMessage = true;

      } else {

        this.user.birthdate = convert(this.date);
        console.log(this.user, 'Esto Actualizo')

        this.showCarga = true;

        this._userService.updateUser(this.user).subscribe(
          response => {
            this.showCarga = false;

            console.log(response, 'RESPONSE')
            if (response) {
              this.status = 'ok';
              if (response.response == 'Updated') {
                this.changeViewsClean();
                this.getUsers();
                this.user = new User(0, "", "", "", "");
                isLoadingResults = true;

                this.snackBar.open(response.message, "", {
                  panelClass: ['colorBueno'],
                  duration: 2100, horizontalPosition: 'end',
                });
              } else {
                this.snackBar.open(response.message, "", {
                  panelClass: ['colorError'],
                  duration: 3100, horizontalPosition: 'end'
                });
              }
            }
          },
          error => {
            this.showCarga = false;

            if (error) {
              console.log(<any>error);
              this.status = 'error';
              this.snackBar.open("Error al actualizar al usuario!", "", {
                panelClass: ['colorError'],
                duration: 3100, horizontalPosition: 'end'
              });
            }
          }
        )
      }

    }
  }



}





//CLASES PARA LOS DIALOGS CRUD
@Component({
  selector: 'create-user',
  templateUrl: 'create-user.html',
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class createDialog {

  public activeLang = ToolbarComponent.activeLang;

  showCarga = false;
  showMessage = false;
  message = "";

  public user: User;
  public userSave: User;
  public status;

  constructor(public dialogRef: MatDialogRef<createDialog>, private snackBar: MatSnackBar, private _userService: UsersService, private translate: TranslateService) {
    this.user = new User(0, "", "", "", "");
    this.userSave = new User(0, "", "", "", "");
    this.translate.setDefaultLang(this.activeLang);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  createUser() {
    console.log(this.user, 'esto agrega')
    if (this.user.identification == '' || this.user.identification == null || this.user.name == '' || this.user.name == null ||
      this.user.lastname == '' || this.user.lastname == null || this.user.birthdate == '' || this.user.birthdate == null) {
      this.message = "Ingrese todos los campos.";
      this.showMessage = true;
    } else {
      let dataEncontrada = datos.filter(item => item.identification == this.user.identification);

      if (dataEncontrada.length > 0) {
        this.message = "La identificación ya existe.";
        this.showMessage = true;

      } else {
        ids += 1;
        this.showMessage = false;
        this.userSave = new User(ids, this.user.identification, this.user.name, this.user.lastname, convert(this.user.birthdate));

        console.log(this.userSave, 'Todo')

        this.showCarga = true;

        this._userService.createUser(this.userSave).subscribe(
          response => {
            this.showCarga = false;

            console.log(response, 'RESPONSE')
            if (response) {
              this.status = 'ok';
              if (response.response == 'Created') {
                this.dialogRef.close();
                isLoadingResults = true;

                this.snackBar.open(response.message, "", {
                  panelClass: ['colorBueno'],
                  duration: 2100, horizontalPosition: 'end',
                });
              } else {
                this.snackBar.open(response.message, "", {
                  panelClass: ['colorError'],
                  duration: 3100, horizontalPosition: 'end'
                });
              }
            }
          },
          error => {
            this.showCarga = false;

            if (error) {
              console.log(<any>error);
              this.status = 'error';
              this.snackBar.open("Error al crear al usuario!", "", {
                panelClass: ['colorError'],
                duration: 3100, horizontalPosition: 'end'
              });
            }
          }
        )
      }


    }

  }

}

@Component({
  selector: 'read-user',
  templateUrl: 'read-user.html',
})
export class readDialog {

  public activeLang = ToolbarComponent.activeLang;

  constructor(
    public dialogRef: MatDialogRef<readDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User, private translate: TranslateService) {
    this.translate.setDefaultLang(this.activeLang);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'update-user',
  templateUrl: 'update-user.html',
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class updateDialog {

  public activeLang = ToolbarComponent.activeLang;

  showCarga = false;
  showMessage = false;
  message = "";
  public user: User;
  public status;
  fechaArray = usuario.birthdate.split('/');
  fecha = this.fechaArray[2] + '-' + this.fechaArray[1] + '-' + this.fechaArray[0];

  date = new Date(this.fecha);


  constructor(
    public dialogRef: MatDialogRef<updateDialog>, private snackBar: MatSnackBar, private _userService: UsersService, private translate: TranslateService) {

    this.date.setHours(this.date.getHours() + 6);
    this.user = new User(usuario.id, usuario.identification, usuario.name, usuario.lastname, usuario.birthdate);
    this.translate.setDefaultLang(this.activeLang);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  async updateUser() {
    if (this.user.identification == '' || this.user.identification == null || this.user.name == '' || this.user.name == null ||
      this.user.lastname == '' || this.user.lastname == null || this.date == null) {
      this.message = "Ingrese todos los campos.";
      this.showMessage = true;
    } else {
      let dataEncontrada = datos.filter(item => item.identification == this.user.identification && item.id != this.user.id);

      if (dataEncontrada.length > 0) {
        this.message = "La identificación ya existe.";
        this.showMessage = true;

      } else {

        this.user.birthdate = convert(this.date);
        console.log(this.user, 'Esto Actualizo')

        this.showCarga = true;

        this._userService.updateUser(this.user).subscribe(
          response => {
            this.showCarga = false;

            console.log(response, 'RESPONSE')
            if (response) {
              this.status = 'ok';
              if (response.response == 'Updated') {
                this.dialogRef.close();
                isLoadingResults = true;

                this.snackBar.open(response.message, "", {
                  panelClass: ['colorBueno'],
                  duration: 2100, horizontalPosition: 'end',
                });
              } else {
                this.snackBar.open(response.message, "", {
                  panelClass: ['colorError'],
                  duration: 3100, horizontalPosition: 'end'
                });
              }
            }
          },
          error => {
            this.showCarga = false;

            if (error) {
              console.log(<any>error);
              this.status = 'error';
              this.snackBar.open("Error al actualizar al usuario!", "", {
                panelClass: ['colorError'],
                duration: 3100, horizontalPosition: 'end'
              });
            }
          }
        )
      }

    }
  }

}

@Component({
  selector: 'delete-user',
  templateUrl: 'delete-user.html',
})
export class deleteDialog {

  public activeLang = ToolbarComponent.activeLang;

  showCarga = false;
  public status;

  constructor(
    public dialogRef: MatDialogRef<deleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserData, private snackBar: MatSnackBar, private _userService: UsersService, private translate: TranslateService) {
    this.translate.setDefaultLang(this.activeLang);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  async deleteUser() {
    console.log(this.data, 'Esto Elimina')

    this.showCarga = true;

    this._userService.deleteUser(this.data.id).subscribe(
      response => {
        this.showCarga = false;

        console.log(response, 'RESPONSE')
        if (response) {
          this.status = 'ok';
          if (response.response == 'Deleted') {
            eliminadoResponsive = true;
            isLoadingResults = true;
            this.dialogRef.close();

            this.snackBar.open(response.message, "", {
              panelClass: ['colorBueno'],
              duration: 2100, horizontalPosition: 'end',
            });
          } else {
            this.snackBar.open(response.message, "", {
              panelClass: ['colorError'],
              duration: 3100, horizontalPosition: 'end'
            });
          }
        }
      },
      error => {
        this.showCarga = false;

        if (error) {
          console.log(<any>error);
          this.status = 'error';
          this.snackBar.open("Error al eliminar al usuario!", "", {
            panelClass: ['colorError'],
            duration: 3100, horizontalPosition: 'end'
          });
        }
      }
    )

  }

}

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [day, mnth, date.getFullYear()].join("/");
}