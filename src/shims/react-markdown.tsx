import * as React from "react";

interface ReactMarkdownProps {
	children?: string;
	className?: string;
}

const parseInlineMarkdown = (text: string, keyPrefix: string): React.ReactNode[] => {
	const pattern = /(\[[^\]]+\]\((https?:\/\/[^\s)]+)\)|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g;
	const nodes: React.ReactNode[] = [];
	let lastIndex = 0;
	let matchIndex = 0;

	for (const match of text.matchAll(pattern)) {
		const matchedText = match[0];
		const start = match.index ?? 0;

		if (start > lastIndex) {
			nodes.push(text.slice(lastIndex, start));
		}

		const key = `${keyPrefix}-${matchIndex}`;
		matchIndex += 1;

		if (matchedText.startsWith("[")) {
			const linkMatch = matchedText.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
			if (linkMatch) {
				nodes.push(
					<a key={key} href={linkMatch[2]} target="_blank" rel="noreferrer">
						{linkMatch[1]}
					</a>
				);
			} else {
				nodes.push(matchedText);
			}
		} else if (matchedText.startsWith("**") || matchedText.startsWith("__")) {
			nodes.push(<strong key={key}>{matchedText.slice(2, -2)}</strong>);
		} else if (matchedText.startsWith("*") || matchedText.startsWith("_")) {
			nodes.push(<em key={key}>{matchedText.slice(1, -1)}</em>);
		} else if (matchedText.startsWith("`")) {
			nodes.push(<code key={key}>{matchedText.slice(1, -1)}</code>);
		}

		lastIndex = start + matchedText.length;
	}

	if (lastIndex < text.length) {
		nodes.push(text.slice(lastIndex));
	}

	return nodes;
};

const renderParagraph = (lines: string[], key: string): React.JSX.Element => (
	<p key={key}>{parseInlineMarkdown(lines.join(" "), `${key}-inline`)}</p>
);

export default function ReactMarkdown({ children = "", className }: Readonly<ReactMarkdownProps>): React.JSX.Element {
	const lines = children.split(/\r?\n/);
	const blocks: React.JSX.Element[] = [];
	let paragraphLines: string[] = [];
	let listItems: string[] = [];
	let orderedListItems: string[] = [];
	let codeLines: string[] = [];
	let inCodeBlock = false;

	const flushParagraph = () => {
		if (paragraphLines.length > 0) {
			blocks.push(renderParagraph(paragraphLines, `paragraph-${blocks.length}`));
			paragraphLines = [];
		}
	};

	const flushList = () => {
		if (listItems.length > 0) {
			blocks.push(
				<ul key={`ul-${blocks.length}`}>
					{listItems.map((item, index) => (
						<li key={`ul-${blocks.length}-${index}`}>{parseInlineMarkdown(item, `ul-${blocks.length}-${index}`)}</li>
					))}
				</ul>
			);
			listItems = [];
		}
	};

	const flushOrderedList = () => {
		if (orderedListItems.length > 0) {
			blocks.push(
				<ol key={`ol-${blocks.length}`}>
					{orderedListItems.map((item, index) => (
						<li key={`ol-${blocks.length}-${index}`}>{parseInlineMarkdown(item, `ol-${blocks.length}-${index}`)}</li>
					))}
				</ol>
			);
			orderedListItems = [];
		}
	};

	for (const line of lines) {
		if (line.trim().startsWith("```")) {
			flushParagraph();
			flushList();
			flushOrderedList();
			if (inCodeBlock) {
				blocks.push(
					<pre key={`pre-${blocks.length}`}>
						<code>{codeLines.join("\n")}</code>
					</pre>
				);
				codeLines = [];
			}
			inCodeBlock = !inCodeBlock;
			continue;
		}

		if (inCodeBlock) {
			codeLines.push(line);
			continue;
		}

		if (line.trim() === "") {
			flushParagraph();
			flushList();
			flushOrderedList();
			continue;
		}

		const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
		if (headingMatch) {
			flushParagraph();
			flushList();
			flushOrderedList();
			const level = headingMatch[1].length;
			const headingContent = parseInlineMarkdown(headingMatch[2], `h${level}-${blocks.length}`);
			const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;
			blocks.push(React.createElement(HeadingTag, { key: `h-${blocks.length}` }, headingContent));
			continue;
		}

		const unorderedMatch = line.match(/^\s*[-*+]\s+(.+)$/);
		if (unorderedMatch) {
			flushParagraph();
			flushOrderedList();
			listItems.push(unorderedMatch[1]);
			continue;
		}

		const orderedMatch = line.match(/^\s*\d+\.\s+(.+)$/);
		if (orderedMatch) {
			flushParagraph();
			flushList();
			orderedListItems.push(orderedMatch[1]);
			continue;
		}

		paragraphLines.push(line.trim());
	}

	flushParagraph();
	flushList();
	flushOrderedList();

	if (inCodeBlock && codeLines.length > 0) {
		blocks.push(
			<pre key={`pre-${blocks.length}`}>
				<code>{codeLines.join("\n")}</code>
			</pre>
		);
	}

	return <div className={className}>{blocks.length > 0 ? blocks : children}</div>;
}
