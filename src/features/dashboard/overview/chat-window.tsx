"use client";

import * as React from "react";
import { useEffect } from "react";
import {
	Alert,
	Avatar,
	Box,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Divider,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";
import { RobotIcon } from "@phosphor-icons/react/dist/ssr/Robot";
import { SparkleIcon } from "@phosphor-icons/react/dist/ssr/Sparkle";
import { TrendUpIcon } from "@phosphor-icons/react/dist/ssr/TrendUp";
import { UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { id } from "ci-info";
import ReactMarkdown from "react-markdown";

import { ChatApiResponse, sendHomeChatMessage } from "@/lib/api/chat";

const quickPrompts = [
	"Summarize this month's spending pattern",
	"Where can I reduce unnecessary expenses?",
	"Show me suspicious or unusual transactions",
	"How can I improve monthly savings by 10%?",
];
interface ChatItem extends ChatApiResponse {
	id: number;
}
export function ChatWindow(): React.JSX.Element {
	const [messages, setMessages] = React.useState<ChatItem[]>([
		{
			id: Math.random() * 100,
			messageRole: "assistant",
			message: "Hi! I can help explain spending trends and suggest practical next steps for your budget.",
		},
	]);
	const [prompt, setPrompt] = React.useState("");
	const [isSending, setIsSending] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const scrollAnchorRef = React.useRef<HTMLDivElement>(null);

	useEffect(() => {
		onSendMessage();
	}, []);
	React.useEffect(() => {
		scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isSending]);

	const onSendMessage = React.useCallback(async () => {
		const trimmedPrompt = prompt.trim();
		setPrompt("");
		setError(null);
		setMessages((current) => [...current, { id: Math.random() * 100, messageRole: "user", message: trimmedPrompt }]);
		setIsSending(true);

		try {
			const assistantReply: ChatApiResponse[] = await sendHomeChatMessage(trimmedPrompt);
			let chatItems: ChatItem[] = assistantReply.map((reply: ChatApiResponse): ChatItem => {
				return { id: Math.random() * 100, messageRole: "assistant", message: reply.messageRole };
			});

			setMessages(chatItems);
		} catch (chatError) {
			console.error(chatError);
			setError("Unable to reach the assistant right now. Please try again in a moment.");
		} finally {
			setIsSending(false);
		}
	}, [isSending, prompt]);

	const onQuickPrompt = React.useCallback(
		(value: string) => {
			setPrompt(value);
		},
		[setPrompt]
	);

	return (
		<Card
			sx={{
				borderRadius: 4,
				overflow: "hidden",
				boxShadow: "0px 20px 45px rgba(35, 45, 65, 0.14)",
				border: "1px solid",
				borderColor: "divider",
			}}
		>
			<CardContent sx={{ p: 0 }}>
				<Box
					sx={{
						px: { xs: 2, md: 3 },
						py: 2.5,
						background:
							"linear-gradient(135deg, rgba(79,70,229,0.95) 0%, rgba(37,99,235,0.9) 45%, rgba(6,182,212,0.88) 100%)",
						color: "common.white",
					}}
				>
					<Stack direction="row" spacing={1.5} alignItems="center">
						<Avatar sx={{ width: 38, height: 38, bgcolor: "rgba(255,255,255,0.2)" }}>
							<SparkleIcon size={18} weight="fill" />
						</Avatar>
						<Box>
							<Typography variant="h6" sx={{ fontWeight: 700 }}>
								AI Expense Co-Pilot
							</Typography>
							<Typography variant="body2" sx={{ opacity: 0.95 }}>
								Fast answers, clear insights, and practical actions.
							</Typography>
						</Box>
					</Stack>

					<Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", rowGap: 1 }}>
						<Chip
							icon={<TrendUpIcon size={14} />}
							label="Spending Trends"
							size="small"
							sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "common.white" }}
						/>
						<Chip label="Savings Tips" size="small" sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "common.white" }} />
						<Chip
							label="Category Insights"
							size="small"
							sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "common.white" }}
						/>
					</Stack>
				</Box>

				<Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						Try one of these:
					</Typography>
					<Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
						{quickPrompts.map((quickPrompt) => (
							<Chip
								key={quickPrompt}
								label={quickPrompt}
								variant="outlined"
								onClick={() => onQuickPrompt(quickPrompt)}
								sx={{ borderRadius: 2 }}
							/>
						))}
					</Stack>
				</Box>

				<Box
					sx={{
						p: { xs: 2, md: 3 },
						display: "flex",
						flexDirection: "column",
						gap: 1.5,
						minHeight: 460,
						maxHeight: 540,
						overflowY: "auto",
					}}
				>
					{messages.map((message) => {
						const isUser = message.messageRole === "user";
						return (
							<Stack
								key={message.id}
								direction="row"
								spacing={1}
								justifyContent={isUser ? "flex-end" : "flex-start"}
								alignItems="flex-end"
							>
								{isUser ? null : (
									<Avatar sx={{ width: 30, height: 30, bgcolor: "secondary.main" }}>
										<RobotIcon size={18} weight="fill" />
									</Avatar>
								)}
								<Box
									sx={{
										maxWidth: { xs: "90%", md: "75%" },
										px: 1.8,
										py: 1.3,
										borderRadius: 2,
										bgcolor: isUser ? "primary.main" : "background.paper",
										color: isUser ? "primary.contrastText" : "text.primary",
										border: isUser ? "none" : "1px solid",
										borderColor: "divider",
										boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
									}}
								>
									<Box
										sx={{
											fontSize: "0.875rem",
											lineHeight: 1.55,
											"& p": { my: 0 },
											"& p + p": { mt: 1 },
											"& ul, & ol": { my: 0, pl: 2.5 },
											"& li + li": { mt: 0.5 },
											"& pre": {
												overflowX: "auto",
												borderRadius: 1,
												bgcolor: "action.hover",
												px: 1,
												py: 0.75,
												my: 0.75,
											},
											"& code": {
												fontFamily: "var(--font-roboto-mono)",
												fontSize: "0.8125rem",
											},
										}}
									>
										<ReactMarkdown>{message.message}</ReactMarkdown>
									</Box>
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
					<Box sx={{ px: { xs: 2, md: 3 }, pb: 1.5 }}>
						<Alert severity="error">{error}</Alert>
					</Box>
				) : null}

				<Divider />
				<Stack direction="row" spacing={1.5} sx={{ p: { xs: 1.75, md: 2.25 } }}>
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
						placeholder="Ask your question..."
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
