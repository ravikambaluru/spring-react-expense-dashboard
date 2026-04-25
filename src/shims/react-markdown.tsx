import * as React from "react";

interface ReactMarkdownProps {
	children: string;
	className?: string;
}

const escapeHtml = (value: string): string =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");

const toHtml = (value: string): string => {
	const escaped = escapeHtml(value);

	return escaped
		.replaceAll(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
		.replaceAll(/__(.+?)__/g, "<strong>$1</strong>")
		.replaceAll(/\*(.+?)\*/g, "<em>$1</em>")
		.replaceAll(/_(.+?)_/g, "<em>$1</em>")
		.replaceAll(/`([^`]+)`/g, "<code>$1</code>")
		.replaceAll(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
		.replaceAll("\n", "<br />");
};

export default function ReactMarkdown({ children, className }: Readonly<ReactMarkdownProps>): React.JSX.Element {
	return <span className={className} dangerouslySetInnerHTML={{ __html: toHtml(children) }} />;
}
