const focusableSelector = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

function visibleFocusableCandidates(scope: Document | ShadowRoot, anchor: HTMLElement) {
	return [...scope.querySelectorAll<HTMLElement>(focusableSelector)].filter((candidate) => (
		!anchor.contains(candidate) && candidate.getClientRects().length > 0
	));
}

function adjacentCandidate(anchor: HTMLElement, candidates: HTMLElement[]) {
	const NodeCtor = anchor.ownerDocument.defaultView?.Node;
	const following = NodeCtor?.DOCUMENT_POSITION_FOLLOWING ?? 4;
	const preceding = NodeCtor?.DOCUMENT_POSITION_PRECEDING ?? 2;
	return candidates.find((candidate) => Boolean(anchor.compareDocumentPosition(candidate) & following))
		?? [...candidates].reverse().find((candidate) => Boolean(anchor.compareDocumentPosition(candidate) & preceding));
}

export function adjacentFocusTarget(receiptRoot: HTMLElement) {
	const ownerDocument = receiptRoot.ownerDocument;
	const componentRoot = receiptRoot.getRootNode();
	const ShadowRootCtor = ownerDocument.defaultView?.ShadowRoot;
	if (ShadowRootCtor && componentRoot instanceof ShadowRootCtor) {
		const shadowTarget = adjacentCandidate(
			receiptRoot,
			visibleFocusableCandidates(componentRoot, receiptRoot)
		);
		if (shadowTarget) return shadowTarget;
		return adjacentCandidate(
			componentRoot.host as HTMLElement,
			visibleFocusableCandidates(ownerDocument, componentRoot.host as HTMLElement)
		);
	}
	return adjacentCandidate(
		receiptRoot,
		visibleFocusableCandidates(ownerDocument, receiptRoot)
	);
}

export function dismissWithFocusRecovery(
	event: MouseEvent,
	receiptRoot: HTMLElement,
	ondone?: () => void,
	isFocusVisible = (target: HTMLElement) => target.matches(':focus-visible')
) {
	const HTMLElementCtor = receiptRoot.ownerDocument.defaultView?.HTMLElement;
	const source = event.currentTarget;
	const recoveryTarget = event.detail === 0 && HTMLElementCtor && source instanceof HTMLElementCtor && isFocusVisible(source)
		? adjacentFocusTarget(receiptRoot)
		: undefined;
	recoveryTarget?.focus();
	ondone?.();
}
