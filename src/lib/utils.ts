import { twMerge } from 'tailwind-merge'

export function cn(...inputs: (string | undefined | null | false)[]) {
	return twMerge(inputs.filter(Boolean).join(' '))
}

let counter = 0

export function generateId(prefix = 'id') {
	counter++
	return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`
}
