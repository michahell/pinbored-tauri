import { sameTag, SheriffConfig } from '@softarc/sheriff-core'

export const sheriffConfig: SheriffConfig = {
  enableBarrelLess: true, // <-- this is important
  autoTagging: true,
  ignoreFileExtensions: ['pdf'],
  modules: {
    'libs/ui/<any>/src': ['type:ui'],
    'src/app': {
      pages: {
        bookmark: ['domain:pinbored'],
        bookmarks: ['domain:pinbored'],
        notes: ['domain:pinbored'],
        tag: ['domain:pinbored'],
        tags: ['domain:pinbored'],
        settings: [`domain:core`],
        login: ['domain:login'],
      },
      shared: {
        auth: ['domain:auth'],
        components: ['type:ui'],
        core: ['domain:core'],
        models: ['type:data'],
        services: {
          bookmarks: ['domain:pinbored'],
          tags: ['domain:pinbored'],
          'stale-checker': ['domain:pinbored'],
          'progress-bar': ['type:ui'],
          sqlite: ['domain:core'],
        },
      },
      styles: ['type:ui'],
    },
  },
  depRules: {
    root: ['domain:*', 'type:feature', 'type:ui', 'type:config', 'noTag'],
    noTag: ['noTag'],
    'domain:pinbored': [sameTag, 'domain:core', 'type:ui', 'type:data'],
    'domain:login': [sameTag, 'domain:auth', 'type:ui', 'type:data'],
    'domain:auth': [sameTag, 'domain:core'],
    'domain:core': [sameTag, 'type:data', 'type:ui'],
    'type:ui': [sameTag, 'domain:pinbored', 'domain:core', 'domain:auth', 'type:data'],
    'type:data': [sameTag],
  },
}
