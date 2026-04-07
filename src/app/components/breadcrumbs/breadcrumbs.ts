import { Component } from '@angular/core'
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb'

@Component({
  selector: 'app-breadcrumbs',
  imports: [HlmBreadCrumbImports],
  templateUrl: './breadcrumbs.html',
})
export class Breadcrumbs {}
