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
        core: {
          fetch: ['domain:data'],
          'tauri-store': ['domain:data'],
          '<core>': ['domain:core'],
        },
        'data-providers/<provider>': ['domain:data'],
        services: {
          bookmarks: ['domain:pinbored'],
          'data-provider': ['domain:data'],
          'pinboard-importer': ['domain:data'],
          'progress-bar': ['type:ui'],
          'stale-checker': ['domain:data'],
          tags: ['domain:pinbored'],
        },
      },
      styles: ['type:ui'],
    },
  },
  depRules: {
    root: ['domain:*', 'type:*', 'noTag'],
    noTag: ['noTag'],
    'domain:pinbored': [sameTag, 'domain:core', 'domain:data', 'type:ui', 'type:external-ui', 'pinboard-facade'],
    'domain:login': [sameTag, 'domain:core', 'domain:data', 'domain:auth', 'type:ui', 'type:external-ui'],
    'domain:auth': [sameTag, 'domain:core', 'domain:data', 'pinboard-facade', 'pinboard-service'],
    'domain:core': [sameTag, 'domain:data', 'type:ui', 'pinboard-facade'],
    'domain:data': [sameTag, 'domain:core', 'type:ui'],
    'type:ui': [
      sameTag,
      'domain:pinbored',
      'domain:data',
      'domain:core',
      'domain:auth',
      'type:external-ui',
      'pinboard-facade', // REMOVE THIS TEMP WORKAROUND FOR CELL-ACTION-DROPDOWN BY USING STATE MGMT: UI->ACTION->FACADE
    ],
    'type:external-ui': [sameTag],
    'pinboard-facade': ['domain:core', 'type:data', 'pinboard-service'],
    'pinboard-service': ['domain:core', 'type:data'],
  },
}
