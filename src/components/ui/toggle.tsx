import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export interface ToggleProps extends ComponentProps<'button'> {
	pressed: boolean
	onPressedChange: (pressed: boolean) => void
}

export function Toggle({ className, pressed, onPressedChange, disabled, ...props }: ToggleProps) {
	return (
		<button
			type="button"
			role="switch"
			data-slot="toggle"
			aria-checked={pressed}
			data-disabled={disabled ? '' : undefined}
			data-state={pressed ? 'on' : 'off'}
			className={twMerge(
				'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
				'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
				pressed ? 'bg-primary' : 'bg-muted',
				className
			)}
			disabled={disabled}
			onClick={() => onPressedChange(!pressed)}
			{...props}
		>
			<span
				className={twMerge(
					'pointer-events-none block size-4 rounded-full bg-foreground shadow-lg transition-transform',
					pressed ? 'translate-x-4' : 'translate-x-0'
				)}
			/>
		</button>
	)
}
