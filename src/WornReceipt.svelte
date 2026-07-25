<script lang="ts">
	import { fly } from 'svelte/transition';

	interface Props {
		summary: string;
		cells?: Array<{ label: string; value: string }>;
		undoAvailable?: boolean;
		onundo?: () => void;
		ondone?: () => void;
	}

	let { summary, cells, undoAvailable = false, onundo, ondone }: Props = $props();
</script>

<div class="worn-receipt" role="status" aria-live="polite" aria-atomic="true" in:fly={{ y: -8, duration: 220 }}>
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
	<div class="worn-receipt-actions">
		{#if undoAvailable}
			<button type="button" class="worn-btn" onclick={onundo} title="Undo this action and restore the previous state.">Undo</button>
		{/if}
		<button type="button" class="worn-btn" onclick={ondone}>Dismiss</button>
	</div>
</div>

<style>
	.worn-receipt {
		margin-top: 12px;
		border: 1px solid var(--cockpit-border);
		border-radius: var(--cockpit-radius);
		background: var(--cockpit-surface);
		padding: 12px 14px;
		display: grid;
		gap: 8px;
	}
	.worn-receipt-head {
		display: grid;
		gap: 2px;
		border-bottom: 1px solid var(--cockpit-border);
		padding-bottom: 8px;
	}
	.worn-receipt-head span {
		text-transform: uppercase;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--cockpit-text-muted);
	}
	.worn-receipt-head strong {
		color: var(--cockpit-text);
		font-weight: 560;
		font-size: 14px;
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
		border-bottom: 1px solid var(--cockpit-border);
	}
	.worn-receipt-lines > div:last-child { border-bottom: 0; }
	.worn-receipt-lines span {
		text-transform: uppercase;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--cockpit-text-muted);
	}
	.worn-receipt-lines strong {
		color: var(--cockpit-text);
		font-weight: 520;
		font-size: 13px;
		overflow-wrap: anywhere;
	}
	.worn-receipt-actions {
		display: flex;
		gap: 8px;
		padding-top: 4px;
	}
	.worn-receipt:focus-visible {
		outline: 2px dashed var(--cockpit-accent);
		outline-offset: 2px;
	}
	.worn-btn {
		align-items: center;
		background: transparent;
		border: 1px solid var(--cockpit-border);
		border-radius: 999px;
		color: var(--cockpit-text-secondary);
		cursor: pointer;
		display: inline-flex;
		font-size: 12px;
		font-weight: 560;
		gap: 6px;
		padding: 3px 10px;
		transition: background-color 0.12s ease;
	}
	.worn-btn:hover { background: var(--cockpit-hover-bg); color: var(--cockpit-text); }
	.worn-btn:focus-visible { outline: 2px dashed var(--cockpit-accent); outline-offset: 2px; }
</style>
