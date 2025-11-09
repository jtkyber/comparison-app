export function moveCaretToEnd(target: HTMLElement, multiLine?: boolean) {
	const range = document.createRange();
	const sel = window.getSelection();
	if (!sel) return;
	range.selectNodeContents(target);
	range.collapse(false);
	sel.removeAllRanges();
	sel.addRange(range);
	target.focus();
	range.detach();
	if (multiLine) target.scrollTop = target.scrollHeight;
}

export function sanitizeNumInputValue(value: string): string {
	if (!value) return '0';

	let s = value.trim();

	// preserve single leading minus and remove any other '-'
	let neg = '';
	if (s === '0-') {
		s = '';
		neg = '-';
	} else if (s.startsWith('-')) {
		neg = '-';
		s = s.slice(1);
	}
	s = s.replace(/-/g, '');

	// remove all characters except digits and dot
	s = s.replace(/[^0-9.]/g, '');

	// keep only the first decimal point
	const dotIndex = s.indexOf('.');
	if (dotIndex !== -1) {
		s = s.slice(0, dotIndex + 1) + s.slice(dotIndex + 1).replace(/\./g, '');
	}

	// if user typed ".5" convert to "0.5"
	if (s.startsWith('.')) s = '0' + s;

	// If there's more than one char and it starts with '0' but next char is NOT '.', strip leading zeros
	if (s.length > 1 && s[0] === '0' && s[1] !== '.') {
		// remove all leading zeros (but leave one zero if everything becomes empty)
		s = s.replace(/^0+/, '');
		if (s === '') s = '0';
	}

	// allow the user to have just '-' while typing
	if (s === '') return neg ? '-' : '';

	return neg + s;
}

export function getElementTree(root: Element): Element[] {
	const nodes: Element[] = [];
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
	nodes.push(root);
	let node: Node | null;
	// treeWalker.nextNode() returns Node | null
	while ((node = walker.nextNode())) {
		nodes.push(node as Element);
	}
	return nodes;
}

export function getElementSnapshot(rootEl: HTMLElement): HTMLElement {
	// Deep clone the element
	const cloneRoot = rootEl.cloneNode(true) as HTMLElement;

	const origNodes = getElementTree(rootEl);
	const cloneNodes = getElementTree(cloneRoot);

	// In the unlikely event they differ in length, map up to the smaller length
	const count = Math.min(origNodes.length, cloneNodes.length);

	for (let i = 0; i < count; i++) {
		const orig = origNodes[i] as Element;
		const copy = cloneNodes[i] as Element;

		// Inline computed styles
		const cs = window.getComputedStyle(orig as Element);
		let styleText = '';
		for (let j = 0; j < cs.length; j++) {
			const prop = cs[j];
			// getPropertyValue ensures we get the full value as string
			styleText += `${prop}: ${cs.getPropertyValue(prop)}; `;
		}

		// Merge with any existing inline style on the copy (rare because it was cloned,
		// but keep copy's attribute if present)
		const existing = copy.getAttribute('style') ?? '';
		copy.setAttribute('style', `${existing} ${styleText}`.trim());

		// Copy form state where appropriate
		// Note: cloned inputs/selects/textarea will be the same element types
		if (orig instanceof HTMLInputElement && copy instanceof HTMLInputElement) {
			if (orig.type === 'checkbox' || orig.type === 'radio') {
				copy.checked = orig.checked;
				if (orig.checked) copy.setAttribute('checked', 'checked');
				else copy.removeAttribute('checked');
			} else {
				copy.value = orig.value;
				// Keep the value attribute consistent too
				copy.setAttribute('value', orig.value);
			}
		} else if (orig instanceof HTMLTextAreaElement && copy instanceof HTMLTextAreaElement) {
			copy.value = orig.value;
			copy.textContent = orig.value;
		} else if (orig instanceof HTMLSelectElement && copy instanceof HTMLSelectElement) {
			try {
				copy.value = orig.value;
			} catch {
				// Some cloned selects might not accept the value if options differ;
				// fall back to matching selectedIndex
				copy.selectedIndex = orig.selectedIndex;
			}
		}
	}

	return cloneRoot;
}
