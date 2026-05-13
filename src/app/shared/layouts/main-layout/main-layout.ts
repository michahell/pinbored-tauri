import { Component } from '@angular/core'
import { Menu } from '@components/menu/menu'

@Component({
  selector: 'app-main-layout',
  imports: [Menu],
  templateUrl: './main-layout.html',
})
export class MainLayout {}
