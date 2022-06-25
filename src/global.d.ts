/// <reference types="svelte" />

// TODO add PR on @types/nprogress and add this
declare module 'nprogress' {
	interface NProgressOptionsObj {
		minimum?: number
		template?: string
		easing?: string
		speed?: number
		trickle?: boolean
		trickleSpeed?: number
		showSpinner?: boolean
		parent?: string
	}
	function configure(options: NProgressOptionsObj): any

	function start(): void
	function done(done?: boolean): void
	function inc(amount: number): void
	function set(amount: number): void
}
