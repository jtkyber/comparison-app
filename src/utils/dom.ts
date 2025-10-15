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
	if (!value) return '';

	let s = value.trim();

	// preserve single leading minus and remove any other '-'
	let neg = '';
	if (s.startsWith('-')) {
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
