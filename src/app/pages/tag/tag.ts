import { Component, inject } from '@angular/core'
import { MainLayout } from '@components/layouts/main-layout/main-layout'
import { BigTag } from '@components/big-tag/big-tag/big-tag'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-tag',
  imports: [MainLayout, BigTag],
  templateUrl: './tag.html',
})
export default class Tag {
  #activatedRoute = inject(ActivatedRoute)

  constructor() {
    console.log('route data: ', this.#activatedRoute.snapshot.data)
  }
}
