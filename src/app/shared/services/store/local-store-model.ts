import { PinboardItemVM } from '../../models/pinboard-view.model'

export interface LocalStoreModel {
  username: string
  token: string
  bookmarks: PinboardItemVM[]
  [key: string]: any
}
