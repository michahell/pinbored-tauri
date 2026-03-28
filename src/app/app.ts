import { invoke } from '@tauri-apps/api/core'
import { Component, effect, inject, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { storage, speechSynthesis, favicon } from '@signality/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { MockPinboardItem, StaleChecker } from './services/stale-checker'
import { StaleTable } from './components/stale-table/stale-table'
import { Payment } from './components/stale-table/stale-table.model'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, HlmButtonImports, StaleTable],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  greetingMessage = ''
  #PAYMENT_DATA: Payment[] = [
    {
      id: 'm5gr84i9',
      amount: 316,
      status: 'success',
      email: 'ken99@yahoo.com',
    },
    {
      id: '3u1reuv4',
      amount: 242,
      status: 'success',
      email: 'Abe45@gmail.com',
    },
    {
      id: 'derv1ws0',
      amount: 837,
      status: 'processing',
      email: 'Monserrat44@gmail.com',
    },
    {
      id: '5kma53ae',
      amount: 874,
      status: 'success',
      email: 'Silas22@gmail.com',
    },
    {
      id: 'bhqecj4p',
      amount: 721,
      status: 'failed',
      email: 'carmella@hotmail.com',
    },
  ]
  data = signal<Payment[]>(this.#PAYMENT_DATA)

  readonly value = storage('key', 'Hi, Angular!') // Web Storage API
  readonly synthesis = speechSynthesis() // Web Speech API
  readonly fav = favicon() // Dynamic Favicon
  readonly #staleChecker = inject(StaleChecker)

  readonly #mockPinboardList = [
    {
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      id: 'link-one',
    },
    {
      url: 'https://free.mockerapi.com/status/404', // returns 404
      id: 'link-two',
    },
    {
      url: 'https://free.mockerapi.com/delay/3', // delayed by 3 seconds
      id: 'link-three',
    },
    {
      url: 'https://apifastmock.com/mock/vq8uvNw3xziUcsxnrz0YTmvMPQBODR-CI9wqVrRsjqt_AtxdiuQn5bgMiS3JLAfidJwTCLewN7Tv7lwateNOR_BtoEk5l8wlmFvwSH3aqfxCWoDz3Mqtjnss4vK81UbLb_HOsKdE9A9uxHxzagtjkuvBqg2kV88Z', // server 500
      id: 'link-four',
    },
  ]

  constructor() {
    effect(() => {
      if (this.synthesis.isSpeaking()) {
        this.fav.setEmoji('🔊')
      } else {
        this.fav.reset()
      }
    })
  }

  async staleCheck(): Promise<void> {
    // first construct streaming queue object
    try {
      await this.#staleChecker
        .newQueue()
        .startWith(
          this.#mockPinboardList,
          this.#handleStaleCheckerUpdate.bind(this)
        )
    } catch (error) {
      console.error(error)
    }
  }

  #handleStaleCheckerUpdate(
    item: MockPinboardItem,
    response: Response
  ): Promise<void> {
    console.log('stale checker update method called for item: ', item)
    console.log('response: ', response)

    if (!response.ok) {
      console.error(`Response status: ${response.status}`)
      // throw new Error()
    }
    // console.log(response.status) // e.g. 200
    // console.log(response.statusText) // e.g. "OK"
    // console.log(response.body) // body
    // response.json()

    return Promise.resolve()
  }

  async greet(event: SubmitEvent, name: string): Promise<void> {
    event.preventDefault()

    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    invoke<string>('greet', { name }).then((text) => {
      this.greetingMessage = text
    })
  }
}
