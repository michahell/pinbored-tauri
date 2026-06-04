import { Component, ChangeDetectionStrategy } from '@angular/core'
import { Menu } from '@components/menu/menu'

@Component({
  selector: 'app-main-layout',
  imports: [Menu],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './main-layout.html',
})
export class MainLayout {}
