# @wornpage/receipt

Svelte 5 action receipt — an undo-capable result card with a fly-in
transition. Zero dependencies.

A receipt answers "what just happened?" immediately after an action: a summary
line, optional detail cells, and an Undo affordance while one is available.

## Install

```bash
bun add @wornpage/receipt
```

## Usage

```svelte
<script>
  import { WornReceipt } from '@wornpage/receipt';
</script>

<WornReceipt
  summary="Marked lighting-checklist done"
  cells={[
    { label: 'Blocker', value: 'None' },
    { label: 'Next', value: 'Open' }
  ]}
  undoAvailable={true}
  onundo={() => restore()}
  ondone={() => dismiss()}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `summary` | `string` | required | The headline result |
| `cells` | `Array<{ label, value }>` | — | Detail rows under the summary |
| `undoAvailable` | `boolean` | `false` | Show the Undo button |
| `onundo` | `() => void` | — | Undo pressed |
| `ondone` | `() => void` | — | Dismiss pressed |

The card renders with `role="status"` and `aria-live="polite"`, so screen
readers announce the result without stealing focus.

## Pairing with undo

`undoAvailable` is a display flag only — this component owns no state. Drive it
from whatever tracks your undo descriptor, and clear it once the descriptor no
longer matches what is on screen. See [`@wornpage/undo`](https://github.com/wornpage/undo)
for a snapshot stack to pair with it.

## Tests

```bash
bun test
```

## License

MIT
