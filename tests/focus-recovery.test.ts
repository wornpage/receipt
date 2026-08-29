import { describe, expect, it } from 'bun:test';
import { dismissWithFocusRecovery } from '../src/focus-recovery';

const PRECEDING = 2;
const FOLLOWING = 4;

class FakeDocument {
	activeElement: FakeElement | null = null;
	candidates: FakeElement[] = [];
	defaultView: {
		Node: { DOCUMENT_POSITION_FOLLOWING: number; DOCUMENT_POSITION_PRECEDING: number };
		ShadowRoot: typeof FakeShadowRoot;
		HTMLElement: typeof FakeElement;
	};

	constructor() {
		this.defaultView = {
			Node: { DOCUMENT_POSITION_FOLLOWING: FOLLOWING, DOCUMENT_POSITION_PRECEDING: PRECEDING },
			ShadowRoot: FakeShadowRoot,
			HTMLElement: FakeElement
		};
	}

	querySelectorAll() {
		return this.candidates;
	}
}

class FakeElement {
	label: string;
	ownerDocument: FakeDocument;
	visible = true;
	focused = false;
	root: FakeDocument | FakeShadowRoot;
	contained = new Set<FakeElement>();
	relations = new Map<FakeElement, number>();

	constructor(label: string, ownerDocument: FakeDocument) {
		this.label = label;
		this.ownerDocument = ownerDocument;
		this.root = ownerDocument;
	}

	contains(candidate: FakeElement) {
		return candidate === this || this.contained.has(candidate);
	}

	getClientRects() {
		return { length: this.visible ? 1 : 0 };
	}

	compareDocumentPosition(candidate: FakeElement) {
		return this.relations.get(candidate) ?? 1;
	}

	getRootNode() {
		return this.root;
	}

	focus() {
		this.focused = true;
		this.ownerDocument.activeElement = this;
	}

	matches() {
		return true;
	}
}

class FakeShadowRoot {
	host: FakeElement;
	candidates: FakeElement[] = [];

	constructor(host: FakeElement) {
		this.host = host;
	}

	querySelectorAll() {
		return this.candidates;
	}
}

function makeFixture() {
	const document = new FakeDocument();
	const receipt = new FakeElement('Receipt', document);
	const dismiss = new FakeElement('Dismiss', document);
	receipt.contained.add(dismiss);
	return { document, receipt, dismiss };
}

function dismiss(
	detail: number,
	receipt: FakeElement,
	button: FakeElement,
	ondone: () => void
) {
	dismissWithFocusRecovery(
		{ detail, currentTarget: button } as unknown as MouseEvent,
		receipt as unknown as HTMLElement,
		ondone,
		() => true
	);
}

describe('receipt dismiss focus recovery', () => {
	it('focuses the next visible light-DOM control before ondone removes the receipt', () => {
		const { document, receipt, dismiss: button } = makeFixture();
		const previous = new FakeElement('Previous', document);
		const next = new FakeElement('Next', document);
		receipt.relations.set(previous, PRECEDING);
		receipt.relations.set(next, FOLLOWING);
		document.candidates = [previous, next];
		let activeAtCallback = '';

		dismiss(0, receipt, button, () => {
			activeAtCallback = document.activeElement?.label ?? '';
		});

		expect(activeAtCallback).toBe('Next');
		expect(document.activeElement?.label).toBe('Next');
	});

	it('falls back to the nearest previous visible control when none follows', () => {
		const { document, receipt, dismiss: button } = makeFixture();
		const previous = new FakeElement('Previous', document);
		receipt.relations.set(previous, PRECEDING);
		document.candidates = [previous];

		dismiss(0, receipt, button, () => {});

		expect(document.activeElement?.label).toBe('Previous');
	});

	it('skips hidden candidates', () => {
		const { document, receipt, dismiss: button } = makeFixture();
		const hidden = new FakeElement('Hidden', document);
		hidden.visible = false;
		const next = new FakeElement('Next', document);
		receipt.relations.set(hidden, FOLLOWING);
		receipt.relations.set(next, FOLLOWING);
		document.candidates = [hidden, next];

		dismiss(0, receipt, button, () => {});

		expect(document.activeElement?.label).toBe('Next');
	});

	it('does not move focus for pointer-generated dismissal', () => {
		const { document, receipt, dismiss: button } = makeFixture();
		const next = new FakeElement('Next', document);
		receipt.relations.set(next, FOLLOWING);
		document.candidates = [next];

		dismiss(1, receipt, button, () => {});

		expect(document.activeElement).toBeNull();
		expect(next.focused).toBe(false);
	});

	it('keeps recovery inside the receipt shadow root when an adjacent control exists', () => {
		const { document, receipt, dismiss: button } = makeFixture();
		const host = new FakeElement('Host', document);
		const shadow = new FakeShadowRoot(host);
		const previous = new FakeElement('Previous', document);
		const next = new FakeElement('Next', document);
		receipt.root = shadow;
		button.root = shadow;
		previous.root = shadow;
		next.root = shadow;
		receipt.relations.set(previous, PRECEDING);
		receipt.relations.set(next, FOLLOWING);
		shadow.candidates = [previous, next];
		const outside = new FakeElement('Outside', document);
		host.relations.set(outside, FOLLOWING);
		document.candidates = [outside];

		dismiss(0, receipt, button, () => {});

		expect(document.activeElement?.label).toBe('Next');
		expect(outside.focused).toBe(false);
	});

	it('crosses the shadow host only when that root has no adjacent control', () => {
		const { document, receipt, dismiss: button } = makeFixture();
		const host = new FakeElement('Host', document);
		const shadow = new FakeShadowRoot(host);
		receipt.root = shadow;
		button.root = shadow;
		const next = new FakeElement('Next', document);
		host.relations.set(next, FOLLOWING);
		document.candidates = [next];

		dismiss(0, receipt, button, () => {});

		expect(document.activeElement?.label).toBe('Next');
	});
});
