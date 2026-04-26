import { Component } from '@angular/core'
// import { Breadcrumbs } from '../../components/breadcrumbs/breadcrumbs'
import { Menu } from '../../components/menu/menu'
import { DebugInfo } from '../../components/debug-info/debug-info'

@Component({
  selector: 'app-main-layout',
  imports: [Menu, DebugInfo], // Breadcrumbs,
  templateUrl: './main-layout.html',
})
export class MainLayout {}
