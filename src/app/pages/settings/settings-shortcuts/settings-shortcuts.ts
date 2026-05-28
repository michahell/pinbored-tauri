import { AfterViewInit, Component, inject, signal } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmKbdImports } from '@spartan-ng/helm/kbd'
import { Hotkey, HotkeysService, HotkeysShortcutPipe } from '@ngneat/hotkeys'

@Component({
  selector: 'app-settings-shortcuts',
  imports: [HlmCardImports, HlmKbdImports, HotkeysShortcutPipe],
  templateUrl: './settings-shortcuts.html',
})
export default class SettingsShortcuts implements AfterViewInit {
  readonly hotkeyService = inject(HotkeysService)
  readonly hotkeys = signal<Hotkey[] | null>(null)

  ngAfterViewInit(): void {
    const hotkeys = this.hotkeyService.getHotkeys()
    this.hotkeys.set(hotkeys.filter((hotkey) => hotkey.group !== 'hidden'))
    console.log('getting hotkeys... ', this.hotkeys())
  }
}
