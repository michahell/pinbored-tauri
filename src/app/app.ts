import { Component, effect } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { storage, speechSynthesis, favicon } from '@signality/core'
import { invoke } from '@tauri-apps/api/core'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
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

  async greet(event: SubmitEvent, name: string): Promise<void> {
    event.preventDefault()

    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    invoke<string>('greet', { name }).then((text) => {
      // this.greetingMessage = text
    })
  }
}
