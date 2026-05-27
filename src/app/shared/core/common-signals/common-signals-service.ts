import { Injectable } from '@angular/core'
import { breakpoints } from '@signality/core'

@Injectable({
  providedIn: 'root',
})
export class CommonSignalsService {
  breakpoints = breakpoints({
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
  })
}
