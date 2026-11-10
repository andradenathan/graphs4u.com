## Stack

- **React 19** (sem `forwardRef`)
- **TypeScript** strict
- **Tailwind CSS v4** com `@theme` e CSS variables
- **Base UI React** (`@base-ui/react`) para componentes headless
- **Tailwind Variants** (`tailwind-variants`) para variantes
- **Tailwind Merge** (`tailwind-merge`) para merge de classes
- **Lucide React** ou **Phosphor Icons** para ícones

---

## Nomenclatura

- Arquivos: **lowercase com hífens** → `user-card.tsx`, `use-modal.ts`
- **Sempre named exports**, nunca default export
- Não criar barrel files (`index.ts`) para pastas internas

---

## Estrutura de Componente

```tsx
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export const buttonVariants = tv({
	base: [
		'inline-flex cursor-pointer items-center justify-center font-medium rounded-lg border transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
	],
	variants: {
		variant: {
			primary: 'border-primary bg-primary text-primary-foreground hover:bg-primary-hover',
			secondary: 'border-border bg-secondary text-secondary-foreground hover:bg-muted',
			ghost: 'border-transparent bg-transparent text-muted-foreground hover:text-foreground',
			destructive: 'border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90',
		},
		size: {
			sm: 'h-6 px-2 gap-1.5 text-xs [&_svg]:size-3',
			md: 'h-7 px-3 gap-2 text-sm [&_svg]:size-3.5',
			lg: 'h-9 px-4 gap-2.5 text-base [&_svg]:size-4',
		},
	},
	defaultVariants: { variant: 'primary', size: 'md' },
})

export interface ButtonProps
	extends ComponentProps<'button'>,
		VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, disabled, children, ...props }: ButtonProps) {
	return (
		<button
			type="button"
			data-slot="button"
			data-disabled={disabled ? '' : undefined}
			className={twMerge(buttonVariants({ variant, size }), className)}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	)
}
```

---

## Compound Components

```tsx
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export interface CardProps extends ComponentProps<'div'> {}

export function Card({ className, ...props }: CardProps) {
	return (
		<div
			data-slot="card"
			className={twMerge('bg-surface flex flex-col gap-6 rounded-xl border border-border p-6 shadow-sm', className)}
			{...props}
		/>
	)
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
	return <div data-slot="card-header" className={twMerge('flex flex-col gap-1.5', className)} {...props} />
}

export function CardTitle({ className, ...props }: ComponentProps<'h3'>) {
	return <h3 data-slot="card-title" className={twMerge('text-lg font-semibold', className)} {...props} />
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
	return <div data-slot="card-content" className={className} {...props} />
}
```

---

## Cores (CSS Variables)

```
bg-surface, bg-surface-raised       → fundos
bg-primary, bg-secondary, bg-muted  → ações/estados
bg-destructive                      → erros/danger

text-foreground                     → texto principal
text-foreground-subtle              → texto secundário
text-muted-foreground               → texto desabilitado
text-primary-foreground             → texto em bg primary

border-border, border-input         → bordas padrão
border-primary, border-destructive  → bordas de destaque

ring-ring                           → focus ring
```

---

## TypeScript

```tsx
// ✅ Estender ComponentProps + VariantProps
export interface ButtonProps
	extends ComponentProps<'button'>,
		VariantProps<typeof buttonVariants> {}

// ✅ Import type para tipos
import type { ComponentProps } from 'react'
import type { VariantProps } from 'tailwind-variants'

// ❌ Não usar React.FC nem any
```

---

## Padrões Importantes

```tsx
// Sempre usar twMerge
className={twMerge('classes-base', className)}

// Sempre usar data-slot
<div data-slot="card">

// Estados com data-attributes
data-disabled={disabled ? '' : undefined}
className="data-[disabled]:opacity-50 data-[selected]:bg-primary"

// Focus visible
'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

// Ícones com tamanho
<Check className="size-4" />
'[&_svg]:size-3.5' // em variantes

// Botões de ícone precisam de aria-label
<button aria-label="Fechar"><X className="size-4" /></button>

// Props spread no final
{...props}
```

---

## Base UI (componentes headless)

```tsx
// Dialog
import * as Dialog from '@base-ui/react/dialog'
<Dialog.Root><Dialog.Portal><Dialog.Backdrop /><Dialog.Popup /></Dialog.Portal></Dialog.Root>

// Tabs
import * as Tabs from '@base-ui/react/tabs'
<Tabs.Root><Tabs.List><Tabs.Tab /></Tabs.List><Tabs.Panel /></Tabs.Root>

// Select
import * as Select from '@base-ui/react/select'
<Select.Root><Select.Trigger /><Select.Portal><Select.Popup><Select.Item /></Select.Popup></Select.Portal></Select.Root>

// Menu
import * as Menu from '@base-ui/react/menu'
<Menu.Root><Menu.Trigger /><Menu.Portal><Menu.Popup><Menu.Item /></Menu.Popup></Menu.Portal></Menu.Root>
```

## TypeScript
Escreva o código sempre com variáveis discretas, isto é, elas tem que ter um significado e mesmo que isso signifique o nome da função, classe, variável seja muito maior. Exemplo:

```ts
// ERRADO
const acl = user.getAccessLevel();

// CERTO
const accessLevel = user.getAccessLevel()
```
