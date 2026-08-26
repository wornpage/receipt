<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Button } from '@wornpage/button';

	interface Props {
		summary: string;
		cells?: Array<{ label: string; value: string }>;
		undoAvailable?: boolean;
		announce?: boolean;
		id?: string;
		onundo?: () => void;
		ondone?: () => void;
	}

	let { summary, cells, undoAvailable = false, announce = true, id, onundo, ondone }: Props = $props();
</script>

<div
	class="worn-receipt"
	{id}
	tabindex="-1"
	role={announce ? 'status' : undefined}
	aria-live={announce ? 'polite' : undefined}
	aria-atomic={announce ? 'true' : undefined}
	in:fly={{ y: prefersReducedMotion.current ? 0 : -8, duration: prefersReducedMotion.current ? 0 : 220 }}
>
	<div class="worn-receipt-head">
		<span>Last result</span>
		<strong>{summary}</strong>
	</div>
	{#if cells?.length}
		<div class="worn-receipt-lines">
			{#each cells as cell (cell.label)}
				<div><span>{cell.label}</span><strong>{cell.value}</strong></div>
			{/each}
		</div>
	{/if}
	{#if (undoAvailable && onundo) || ondone}
		<div class="worn-receipt-actions">
			{#if undoAvailable && onundo}
				<Button size="sm" onclick={onundo} title="Undo this action and restore the previous state.">Undo</Button>
			{/if}
			{#if ondone}<Button size="sm" onclick={ondone}>Dismiss</Button>{/if}
		</div>
	{/if}
</div>

<style>
	.worn-receipt {
		margin-top: 12px;
		border: 1px solid var(--worn-border);
		border-radius: var(--worn-radius);
		background: var(--worn-surface);
		padding: 12px 14px;
		display: grid;
		gap: 8px;
	}
	.worn-receipt-head {
		display: grid;
		gap: 2px;
		border-bottom: 1px solid var(--worn-border);
		padding-bottom: 8px;
	}
	.worn-receipt-head span {
		text-transform: uppercase;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--worn-text-muted);
	}
	.worn-receipt-head strong {
		color: var(--worn-text);
		font-weight: 560;
		font-size: 14px;
		overflow-wrap: anywhere;
	}
	.worn-receipt-lines {
		display: grid;
		gap: 0;
	}
	.worn-receipt-lines > div {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 10px;
		align-items: baseline;
		padding: 6px 0;
		border-bottom: 1px solid var(--worn-border);
	}
	.worn-receipt-lines > div:last-child { border-bottom: 0; }
	.worn-receipt-lines span {
		text-transform: uppercase;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--worn-text-muted);
	}
	.worn-receipt-lines strong {
		color: var(--worn-text);
		font-weight: 520;
		font-size: 13px;
		overflow-wrap: anywhere;
	}
	.worn-receipt-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding-top: 4px;
	}
	.worn-receipt:focus-visible {
		outline: 2px dashed var(--worn-receipt-focus, var(--worn-focus, var(--worn-text, currentColor)));
		outline-offset: 2px;
	}
</style>
