# @wornpage/receipt

Svelte 5 action receipt — an undo-capable result card with a fly-in
transition and shared Wornpage actions.

A receipt answers "what just happened?" immediately after an action: a summary
line, optional detail cells, and an Undo affordance while one is available.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and published runtime. This package is source-only; it does not ship a generated `dist/` directory.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

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
| `announce` | `boolean` | `true` | Set to `false` when an app-owned live region announces the same result |
| `id` | `string` | — | Optional root element id |
| `onundo` | `() => void` | — | Undo pressed |
| `ondone` | `() => void` | — | Dismiss pressed |

The card renders with `role="status"` and `aria-live="polite"` by default, so
screen readers announce the result without stealing focus. Set `announce={false}`
when a composed application already announces the same action through one
persistent live region.

Actions render only when their handlers exist, use the shared Wornpage Button,
and wrap on narrow screens. Entry motion is disabled when the user prefers
reduced motion.

Keyboard dismissal moves focus to the next visible control outside the receipt,
or the nearest previous control when none follows, before `ondone` removes the
card. Pointer dismissal does not force a focus move.

The receipt root has `tabindex="-1"`, so composed flows can move focus to a new
result without adding it to the sequential tab order. Its focus outline uses
`--worn-receipt-focus`, then `--worn-focus`, `--worn-text`, and
`currentColor` as progressively broader fallbacks.

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
