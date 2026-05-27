import { Component, computed, input } from '@angular/core'
import { HlmIcon } from '@spartan-ng/helm/icon'
import { NgIcon } from '@ng-icons/core'

@Component({
  selector: 'app-big-tag',
  imports: [HlmIcon, NgIcon],
  templateUrl: './big-tag.html',
})
export class BigTag {
  readonly name = input.required<string>()
  readonly isPrivate = computed(() => this.name().substring(0, 1) === '.')
}
