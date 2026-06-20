import { Theme } from '../../../pages/settings/settings-model'

export interface Settings {
  theme: Theme
}

export interface Auth {
  storedUsername: string
  storedToken: string
}
