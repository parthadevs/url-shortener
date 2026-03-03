"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
    role: "user" | "assistant"
    content: string
}

export default function SupportChat() {
    const { token } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm your ShortCash assistant. How can I help you today?" },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            })
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = { role: "user", content: input }
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            })

            if (!response.ok) throw new Error("Failed to get response")

            const data = await response.json()
            setMessages((prev) => [...prev, data])
        } catch (error) {
            console.error("Chat Error:", error)
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "I'm sorry, I encountered an error. Please try again later." },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center transition-shadow"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageSquare className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] bg-background/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-primary/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Sparkles className="w-4 h-4 fill-primary/20" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold">AI Support</h3>
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Always online
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 hover:bg-white/5">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                        >
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={cn(
                                        "flex flex-col gap-1.5 max-w-[85%]",
                                        msg.role === "user" ? "ml-auto items-end" : "items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center gap-1.5 mb-0.5",
                                        msg.role === "user" ? "flex-row-reverse" : ""
                                    )}>
                                        <div className={cn(
                                            "p-1 rounded bg-muted text-muted-foreground",
                                            msg.role === "assistant" ? "bg-primary/10 text-primary" : ""
                                        )}>
                                            {msg.role === "assistant" ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                        </div>
                                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                            {msg.role === "assistant" ? "Assistant" : "You"}
                                        </span>
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/10"
                                            : "bg-white/5 border border-white/5 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                                    <div className="p-2 rounded-lg bg-primary/5">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    </div>
                                    <span className="text-xs italic">Assistant is thinking...</span>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSend()
                                }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all h-10 text-sm"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || isLoading}
                                    className="h-10 w-10 shadow-lg shadow-primary/20"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
