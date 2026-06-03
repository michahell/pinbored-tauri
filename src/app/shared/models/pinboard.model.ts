export interface PinboardItem {
  description?: string
  extended: string
  hash: string
  href: string
  meta: string
  shared: string
  tags: string
  time: string
  toread: string
}

/** posts/update */
export interface PinboardUpdateResult {
  update_time: string
}

/** posts/add, posts/delete */
export interface PinboardResultCode {
  result_code: string
}

/** posts/get, posts/recent */
export interface PinboardPostsResult {
  date: string
  user: string
  posts: PinboardItem[]
}

/** posts/dates */
export interface PinboardDatesResult {
  user: string
  tag: string
  dates: Record<string, string>
}

/** posts/suggest — returns [{ popular: string[] }, { recommended: string[] }] */
export type PinboardSuggestResult = [{ popular: string[] }, { recommended: string[] }]

/** tags/get — tag name -> usage count */
export type PinboardTagsMap = Record<string, string>

/** tags/delete, tags/rename */
export interface PinboardTagResult {
  result: string
}

/** user/secret */
export interface PinboardUserSecret {
  result: string
}

/** user/api_token */
export interface PinboardUserApiToken {
  result: string
}

/** notes/list — individual note summary */
export interface PinboardNote {
  id: string
  title: string
  created_at: string
  updated_at: string
  length: number
}

/** notes/list */
export interface PinboardNotesList {
  count: number
  notes: PinboardNote[]
}

/** notes/{ID} */
export interface PinboardNoteDetail {
  id: string
  title: string
  text: string
  hash: string
  created_at: string
  updated_at: string
  length: number
}
