import { Component } from '@angular/core'
import { Breadcrumbs } from '../../components/breadcrumbs/breadcrumbs'
import { HlmProgress, HlmProgressIndicator } from '@spartan-ng/helm/progress'
import { Menu } from '../../components/menu/menu'

@Component({
  selector: 'app-main-layout',
  imports: [Breadcrumbs, HlmProgress, HlmProgressIndicator, Menu],
  templateUrl: './main-layout.html',
})
export class MainLayout {}
