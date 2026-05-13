import { sameTag, SheriffConfig } from '@softarc/sheriff-core'

export const sheriffConfig: SheriffConfig = {
  enableBarrelLess: true, // <-- this is important
  autoTagging: true,
  ignoreFileExtensions: ['pdf'],
  modules: {
    'libs/ui/<any>/src': ['type:ui'],
    'src/app': {
      pages: {
        bookmark: ['domain:bookmarks', 'type:feature'],
        bookmarks: ['domain:bookmarks', 'type:feature'],
        login: ['domain:login', 'domain:auth', 'type:feature'],
        notes: ['domain:notes', 'type:feature'],
        settings: ['domain:settings', 'type:feature'],
        tag: ['domain:tags', 'type:feature'],
        tags: ['domain:tags', 'type:feature'],
      },
      shared: {
        auth: ['domain:auth'],
        components: ['type:ui'],
        constants: ['type:data'],
        layouts: ['type:ui'],
        models: ['type:data'],
        services: {
          authentication: ['domain:auth'],
          fetch: ['domain:core', 'type:data'],
          pinboard: ['domain:pinboard', 'type:data'],
          'progress-bar': ['type:ui'],
          'stale-checker': ['domain:bookmarks'],
          store: ['domain:core', 'type:data'],
        },
        utils: ['type:config'],
      },
      styles: ['type:ui'],
    },
  },
  depRules: {
    root: ['type:feature', 'type:ui', 'type:config', 'noTag'],
    noTag: ['noTag', 'root'],
    'domain:*': sameTag,
    'domain:bookmarks': ['type:ui', 'type:data'],
    'domain:login': ['type:ui', 'type:data'],
    'domain:notes': ['type:ui', 'type:data'],
    'domain:settings': ['type:ui', 'type:data'],
    'domain:tags': ['type:ui', 'type:data'],
    'domain:auth': ['domain:core'],
    'type:ui': [sameTag, 'type:data'],
    'type:feature': [sameTag, 'type:data'],
  },
}
