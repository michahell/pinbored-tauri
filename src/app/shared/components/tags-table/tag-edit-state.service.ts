import { Injectable, signal } from '@angular/core'
import { TagVM } from '../../models/tag-view.model'

@Injectable({
  providedIn: 'root',
})
export class TagEditStateService {
  readonly selectedTag = signal<TagVM | null>(null)
  close: () => void = () => {}
}
