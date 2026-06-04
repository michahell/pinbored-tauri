import { BookmarkVM } from '../../data-providers/abstract/models/abstract-view.model'

const matchBookmarkVisibility = (visibility: string, bookmark: BookmarkVM): boolean => {
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

const matchBookmarkReadStatus = (readStatus: string, bookmark: BookmarkVM): boolean => {
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

const matchBookmarkTaggedStatus = (tagged: string, bookmark: BookmarkVM): boolean => {
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

export { matchBookmarkVisibility, matchBookmarkReadStatus, matchBookmarkTaggedStatus }
