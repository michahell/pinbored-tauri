import { BookmarkVM } from '@data-providers/abstract'
import { StaleStatus } from '@services/stale-checker'
import { Immutable } from 'signalstory'
import { PinboardTypes } from '@data-providers/pinboard'

const matchBookmarkVisibility = (visibility: string, bookmark: Immutable<BookmarkVM>): boolean => {
  if (visibility === 'all') {
    return true
  } else if (visibility === 'public') {
    return bookmark.shared === 'yes'
  } else if (visibility === 'private') {
    return bookmark.shared === 'no'
  } else {
    return false
  }
}

const matchBookmarkReadStatus = (readStatus: string, bookmark: Immutable<BookmarkVM>): boolean => {
  if (readStatus === 'all') {
    return true
  } else if (readStatus === 'unread') {
    return bookmark.toread === 'yes'
  } else if (readStatus === 'read') {
    return bookmark.toread === 'no'
  } else {
    return false
  }
}

const matchBookmarkTaggedStatus = (tagged: string, bookmark: Immutable<BookmarkVM>): boolean => {
  if (tagged === 'all') {
    return true
  } else if (tagged === 'yes') {
    return bookmark.tags?.length > 0
  } else if (tagged === 'no') {
    return bookmark.tags?.length === 0
  } else {
    return false
  }
}

const getChangeHash = () => {
  return self.crypto.randomUUID()
}

const bookmarksAreEqual = (bookmarkA: Immutable<BookmarkVM>, bookmarkB: Immutable<BookmarkVM>): boolean => {
  return bookmarkA.changeHash == bookmarkB.changeHash
}

const pinboardBookmarkToBookmarkVM = (bookmark: PinboardTypes.PinboardItem) => ({
  ...bookmark,
  tagsList: bookmark.tags.split(' '),
  status: 'unchecked' as StaleStatus,
  changeHash: getChangeHash(),
})

export {
  matchBookmarkVisibility,
  matchBookmarkReadStatus,
  matchBookmarkTaggedStatus,
  getChangeHash,
  bookmarksAreEqual,
  pinboardBookmarkToBookmarkVM,
}
