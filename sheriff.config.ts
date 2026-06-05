import { sameTag, SheriffConfig } from '@softarc/sheriff-core'

export const sheriffConfig: SheriffConfig = {
  enableBarrelLess: true, // <-- this is important
  autoTagging: true,
  ignoreFileExtensions: ['pdf'],
  entryFile: 'src/main.ts',
  modules: {
    'libs/ui/<any>/src': ['type:external-ui'],
    'src/app': {
      pages: {
        login: ['domain:login'],
        '<page>': ['domain:pinbored'],
      },
      shared: {
        auth: ['domain:auth'],
        components: ['type:ui'],
        core: ['domain:core'],
        'data-providers': ['domain:data'],
        services: {
          bookmarks: ['domain:pinbored'],
          'data-provider': ['domain:pinbored'],
          'pinboard-importer': ['domain:core'],
          'progress-bar': ['type:ui'],
          'stale-checker': ['domain:pinbored', 'type:ui'],
          tags: ['domain:pinbored'],
        },
      },
      styles: ['type:ui'],
    },
  },
  depRules: {
    root: ['domain:*', 'type:*', 'noTag'],
    noTag: ['noTag'],
    'domain:pinbored': [
      sameTag,
      'domain:core',
      'domain:data',
      'type:ui',
      'type:external-ui',
      'type:data',
      'pinboard-facade',
    ],
    'domain:login': [sameTag, 'domain:core', 'domain:auth', 'type:ui', 'type:external-ui', 'type:data'],
    'domain:auth': [sameTag, 'domain:core', 'pinboard-facade', 'pinboard-service'],
    'domain:core': [sameTag, 'type:data', 'type:ui', 'pinboard-facade'],
    'type:ui': [
      sameTag,
      'domain:pinbored',
      'domain:core',
      'domain:auth',
      'type:data',
      'type:external-ui',
      'pinboard-facade', // REMOVE THIS TEMP WORKAROUND FOR CELL-ACTION-DROPDOWN BY USING STATE MGMT: UI->ACTION->FACADE
    ],
    'type:external-ui': [sameTag],
    'type:data': [sameTag],
    'pinboard-facade': ['domain:core', 'type:data', 'pinboard-service'],
    'pinboard-service': ['domain:core', 'type:data'],
  },
}
