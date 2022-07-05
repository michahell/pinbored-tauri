interface PinboardNotification {
	id: string // uuid?
	kind: string
	title: string
	subtitle?: string
	caption?: string
}

export type { PinboardNotification }
