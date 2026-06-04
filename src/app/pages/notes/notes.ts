import { Component, ChangeDetectionStrategy } from '@angular/core'
import { MainLayout } from '../../shared/components/layouts/main-layout/main-layout'

@Component({
  selector: 'app-notes',
  imports: [MainLayout],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './notes.html',
})
export default class Notes {}
