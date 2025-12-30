import { Component, OnInit } from '@angular/core';
import * as awesom from '@fortawesome/free-solid-svg-icons';
import { TranslationLoaderService } from '../service/translation-loader.service';
import { locale as english } from '../shared/i18n/en';
import { locale as french } from '../shared/i18n/fr';
// import { experiencesFr } from '../api/experiencesFr';
import { experiencesEn } from '../lang/experiencesEn';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-curriculum-vitae',
  templateUrl: './curriculum-vitae.component.html',
  styleUrls: ['./curriculum-vitae.component.scss'],
})
export class CurriculumVitaeComponent implements OnInit {
  experiences: any = experiencesEn;
  planeIcon: any;
  gameIcon: any;
  volleyBallIcon: any;
  hammerIcon: any;

  constructor(
    private _translationLoaderService: TranslationLoaderService,
    private _translateService: TranslateService
  ) {
    this._translationLoaderService.loadTranslations(english, french);
    this._translateService.onLangChange.subscribe(() => {
      if (this._translateService.currentLang == 'en') {
        this.experiences = experiencesEn;
      }
    });
  }

  ngOnInit(): void {
    this.planeIcon = awesom.faPlane;
    this.gameIcon = awesom.faGamepad;
    this.hammerIcon = awesom.faHammer;
  }

  detailOnClick(experience: any) {
    experience.detailIsDisplayed = !experience.detailIsDisplayed;
  }
}
