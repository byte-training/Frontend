import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  public activeLang = 'es';
  mediaSub: Subscription;
  deviceXs: boolean;

  constructor(
    private translate: TranslateService,
    public mediaObserver: MediaObserver
  ) {
    this.translate.setDefaultLang(this.activeLang);
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
    this.activeLang = lang;
    this.translate.use(lang);
  }

}
