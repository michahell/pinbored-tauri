const randomFrom = function <T = string>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)]
}

export { randomFrom }
