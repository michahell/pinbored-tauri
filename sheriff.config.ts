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
        login: ['domain:login'],
        notes: ['domain:pinbored'],
        settings: [`domain:core`],
        tag: ['domain:pinbored'],
        tags: ['domain:pinbored'],
      },
      shared: {
        auth: ['domain:auth'],
        components: ['type:ui'],
        core: ['domain:core'],
        models: ['type:data'],
        services: {
          'progress-bar': ['type:ui'],
          'stale-checker': ['domain:pinbored'],
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
