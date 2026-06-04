import { Component, ChangeDetectionStrategy } from '@angular/core'
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb'

@Component({
  selector: 'app-breadcrumbs',
  imports: [HlmBreadCrumbImports],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './breadcrumbs.html',
})
export class Breadcrumbs {}
