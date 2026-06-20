import { Component } from '@angular/core'
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb'

@Component({
  selector: 'app-breadcrumbs',
  imports: [HlmBreadcrumbImports],
  templateUrl: './breadcrumbs.html',
})
export class Breadcrumbs {}
