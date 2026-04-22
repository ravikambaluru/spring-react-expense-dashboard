"use client";

import * as React from "react";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";
import { RobotIcon } from "@phosphor-icons/react/dist/ssr/Robot";
import { SparkleIcon } from "@phosphor-icons/react/dist/ssr/Sparkle";
import { UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import {
	Alert,
	Avatar,
	Box,
	Card,
	CardContent,
	CircularProgress,
	Divider,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";

import { sendHomeChatMessage } from "@/lib/api/chat";

type Sender = "assistant" | "user";

interface ChatMessage {
	id: string;
	sender: Sender;
	text: string;
}

export function ChatWindow(): React.JSX.Element {
	const [messages, setMessages] = React.useState<ChatMessage[]>([
		{
			id: "welcome-message",
			sender: "assistant",
			text: "Hi! I can help explain spending trends and suggest next actions. Ask me anything about your finances.",
		},
	]);
	const [prompt, setPrompt] = React.useState("");
	const [isSending, setIsSending] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const scrollAnchorRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isSending]);

	const onSendMessage = React.useCallback(async () => {
		const trimmedPrompt = prompt.trim();
		if (!trimmedPrompt || isSending) {
			return;
		}

		setPrompt("");
		setError(null);
		setMessages((current) => [
			...current,
			{ id: `user-${Date.now()}`, sender: "user", text: trimmedPrompt },
		]);
		setIsSending(true);

		try {
			const assistantReply = await sendHomeChatMessage(trimmedPrompt);
			setMessages((current) => [
				...current,
				{
					id: `assistant-${Date.now()}`,
					sender: "assistant",
					text:
						assistantReply ||
						"I received your message but did not get a response body. Please try again.",
				},
			]);
		} catch (chatError) {
			console.error(chatError);
			setError("Unable to reach the assistant right now. Please try again in a moment.");
		} finally {
			setIsSending(false);
		}
	}, [isSending, prompt]);

	return (
		<Card
			sx={{
				height: "100%",
				borderRadius: 4,
				background:
					"linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(246,248,255,1) 100%)",
				boxShadow: "0px 12px 32px rgba(35, 45, 65, 0.08)",
			}}
		>
			<CardContent sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}>
				<Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2.5, pb: 2 }}>
					<Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
						<SparkleIcon size={18} weight="fill" />
					</Avatar>
					<Box>
						<Typography variant="h6">AI Expense Assistant</Typography>
						<Typography color="text.secondary" variant="body2">
							Ask questions about monthly spending, savings, and categories.
						</Typography>
					</Box>
				</Stack>
				<Divider />

				<Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5, maxHeight: 400, overflowY: "auto" }}>
					{messages.map((message) => {
						const isUser = message.sender === "user";
						return (
							<Stack key={message.id} direction="row" spacing={1} justifyContent={isUser ? "flex-end" : "flex-start"} alignItems="flex-end">
								{isUser ? null : (
									<Avatar sx={{ width: 30, height: 30, bgcolor: "secondary.main" }}>
										<RobotIcon size={18} weight="fill" />
									</Avatar>
								)}
								<Box
									sx={{
										maxWidth: { xs: "85%", md: "75%" },
										px: 1.5,
										py: 1.2,
										borderRadius: 2,
										bgcolor: isUser ? "primary.main" : "background.paper",
										color: isUser ? "primary.contrastText" : "text.primary",
										border: isUser ? "none" : "1px solid",
										borderColor: "divider",
										boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
									}}
								>
									<Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
										{message.text}
									</Typography>
								</Box>
								{isUser ? (
									<Avatar sx={{ width: 30, height: 30, bgcolor: "primary.dark" }}>
										<UserIcon size={18} weight="fill" />
									</Avatar>
								) : null}
							</Stack>
						);
					})}
					{isSending ? (
						<Stack direction="row" spacing={1} alignItems="center">
							<CircularProgress size={18} />
							<Typography variant="body2" color="text.secondary">
								Assistant is thinking...
							</Typography>
						</Stack>
					) : null}
					<div ref={scrollAnchorRef} />
				</Box>

				{error ? (
					<Box sx={{ px: 2.5, pb: 1 }}>
						<Alert severity="error">{error}</Alert>
					</Box>
				) : null}

				<Divider />
				<Stack direction="row" spacing={1.5} sx={{ p: 2 }}>
					<TextField
						fullWidth
						value={prompt}
						onChange={(event) => setPrompt(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter" && !event.shiftKey) {
								event.preventDefault();
								void onSendMessage();
							}
						}}
						placeholder="Type your question..."
						disabled={isSending}
						size="small"
					/>
					<IconButton
						color="primary"
						onClick={() => {
							void onSendMessage();
						}}
						disabled={isSending || !prompt.trim()}
						sx={{
							borderRadius: 2,
							bgcolor: "primary.main",
							color: "primary.contrastText",
							"&:hover": { bgcolor: "primary.dark" },
							"&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
						}}
					>
						<PaperPlaneTiltIcon size={20} weight="bold" />
					</IconButton>
				</Stack>
			</CardContent>
		</Card>
	);
}
