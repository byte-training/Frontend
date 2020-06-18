import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  public static activeLang = 'es';
  mediaSub: Subscription;
  deviceXs: boolean;

  constructor(
    private translate: TranslateService,
    public mediaObserver: MediaObserver,
    private router: Router,
    private location: Location,
  ) {
    this.translate.setDefaultLang(ToolbarComponent.activeLang);
    this.location = location;
  }
  ngOnInit() {
    this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      console.log(result.mqAlias);
      this.deviceXs = result.mqAlias === 'xs' ? true : false;
    })
  }

  ngOnDestroy(): void {
    this.mediaSub.unsubscribe()
    throw new Error("Method not implemented.");
  }

  public cambiarLenguaje(lang) {
    ToolbarComponent.activeLang = lang;
    this.translate.use(lang);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.location.path()]);
    });
  }

}
