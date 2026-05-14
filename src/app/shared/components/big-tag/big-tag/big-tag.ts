import { Component } from '@angular/core'
import { HlmIcon } from '@spartan-ng/helm/icon'
import { NgIcon } from '@ng-icons/core'

@Component({
  selector: 'app-big-tag',
  imports: [HlmIcon, NgIcon],
  templateUrl: './big-tag.html',
  styleUrl: './big-tag.css',
})
export class BigTag {}
