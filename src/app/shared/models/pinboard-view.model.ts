import { PinboardItem } from './pinboard.model'

export type PinboardItemVMStatus =
  | 'unchecked'
  | 'checking'
  | 'ok'
  | 'maybe-stale'
  | 'stale'

export interface PinboardItemVM extends PinboardItem {
  tagsList: string[]
  status: PinboardItemVMStatus
}
