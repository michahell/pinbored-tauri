import { greenBadge, redBadge, skyBadge, yellowBadge } from '@styles/badge-colors'

export function getStaleBadgeColor(status?: string) {
  switch (status) {
    case 'unchecked':
      return 'bg-primary'
    case 'stale':
      return redBadge()
    case 'maybe-stale':
      return yellowBadge()
    case 'checking':
      return skyBadge()
    case 'ok':
      return greenBadge()
    default:
      return ''
  }
}
