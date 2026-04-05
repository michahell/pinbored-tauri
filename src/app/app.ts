import { Component, effect, inject, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { storage, speechSynthesis, favicon } from '@signality/core'
import { invoke } from '@tauri-apps/api/core'
import { Menu } from './components/menu/menu'
import { Authentication } from './services/authentication/authentication'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  readonly #authenticationService = inject(Authentication)

  readonly value = storage('key', 'Hi, Angular!') // Web Storage API
  readonly synthesis = speechSynthesis() // Web Speech API
  readonly fav = favicon() // Dynamic Favicon

  constructor() {
    effect(() => {
      // signality
      if (this.synthesis.isSpeaking()) {
        this.fav.setEmoji('🔊')
      } else {
        this.fav.reset()
      }
    })
  }

  async ngOnInit(): Promise<void> {
    console.log('App initialized, checking authentication...')
    await this.#authenticationService.checkAuthentication()
  }

  async greet(event: SubmitEvent, name: string): Promise<void> {
    event.preventDefault()

    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    invoke<string>('greet', { name }).then((text) => {
      // this.greetingMessage = text
    })
  }
}
