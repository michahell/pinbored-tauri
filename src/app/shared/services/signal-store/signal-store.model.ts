import { Theme } from '@core/models/settings-model'

export interface Settings {
  theme: Theme
}

export interface Auth {
  storedUsername: string
  storedToken: string
}
