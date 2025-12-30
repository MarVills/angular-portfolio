import { Component, OnInit } from '@angular/core';
import { TranslationLoaderService } from '../services/translation-loader.service';
import { locale as english } from '../shared/i18n/en';
import { locale as french } from '../shared/i18n/fr';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  skills: any = {
    technologies: [
      {
        name: 'Angular, Typescript, SCSS',
        percent: 90,
        remark: 'excellent',
      },
      {
        name: 'Wordpress, Java Script, SCSS',
        percent: 80,
        remark: 'very-good',
      },
      { name: 'Laravel, PHP , Java Script', percent: 70, remark: 'good' },
      { name: 'Android, Flutter, Dart', percent: 60, remark: 'fair' },
    ],
    tools: [
      {
        name: 'Git, Github, Bitbucket',
        percent: 90,
        remark: 'excellent',
      },
      {
        name: 'Clickup, Monday.com, Jira, Trello',
        percent: 90,
        remark: 'excellent',
      },
      { name: 'Linux, Windows', percent: 80, remark: 'very-good' },
      { name: 'VS Code', percent: 90, remark: 'excellent' },
    ],
    methodologies: [
      { name: 'Kanban', percent: 90, remark: 'excellent' },
      { name: 'Scrum', percent: 70, remark: 'fair' },
      { name: 'Agile', percent: 90, remark: 'excellent' },
      { name: 'Waterfall', percent: 80, remark: 'very-good' },
    ],
  };

  constructor(private _translationLoaderService: TranslationLoaderService) {
    this._translationLoaderService.loadTranslations(english, french);
  }

  ngOnInit(): void {}
}
