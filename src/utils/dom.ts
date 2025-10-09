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
