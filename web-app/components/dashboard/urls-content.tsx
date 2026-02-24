"use client"

import { useEffect, useState } from "react"
import { Copy, ExternalLink, LinkIcon, MoreHorizontal, Pencil, Trash2, Search, Plus, Zap, MousePointerClick } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/auth-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "../ui/skeleton"

export default function UrlsContent() {
    const { token } = useAuth()
    const { toast } = useToast()
    interface Url {
        id: string
        shortUrl: string
        originalUrl: string
        clicks: number
        earnings: number
        createdAt: string
    }

    const [urls, setUrls] = useState<Url[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [editingUrl, setEditingUrl] = useState<Url | null>(null)
    const [newOriginalUrl, setNewOriginalUrl] = useState("")

    useEffect(() => {
        const fetchUrls = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/urls`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!response.ok) {
                    throw new Error("Failed to fetch URLs")
                }
                const data = await response.json()
                setUrls(data)
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (token) {
            fetchUrls()
        }
    }, [token, toast])

    const filteredUrls = urls.filter(
        (url) =>
            url.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
            url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const copyToClipboard = (text: string): void => {
        navigator.clipboard.writeText(`${window.location.origin}/s/${text}`)
        toast({
            title: "Copied!",
            description: "Short URL copied to clipboard",
        })
    }

    const deleteUrl = async (slug: string): Promise<void> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/urls/${slug}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Failed to delete URL")
            }

            setUrls(urls.filter((url) => url.shortUrl !== slug))
            toast({
                title: "Success",
                description: "URL deleted successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }

    const updateUrl = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/urls/${editingUrl?.shortUrl}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ originalUrl: newOriginalUrl }),
            })

            if (!response.ok) {
                throw new Error("Failed to update URL")
            }

            const updated = await response.json()

            setUrls((prev) =>
                prev.map((url) =>
                    url.shortUrl === editingUrl?.shortUrl ? { ...url, originalUrl: updated.originalUrl } : url,
                ),
            )

            toast({
                title: "Updated",
                description: "URL updated successfully",
            })
            setEditingUrl(null)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, staggerChildren: 0.05 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col gap-8 relative pb-10"
        >
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                    >
                        Manage Links
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-muted-foreground text-lg italic"
                    >
                        Track performance and optimize your shortened URLs.
                    </motion.p>
                </div>
                <motion.div variants={itemVariants}>
                    <Button className="shadow-2xl shadow-primary/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 h-12 px-6 font-bold bg-primary hover:bg-primary/90">
                        <Plus className="w-5 h-5" /> Create New URL
                    </Button>
                </motion.div>
            </div>

            <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-xl overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-xl">Your Shortened Links</CardTitle>
                            <CardDescription>A total of {urls.length} links generated</CardDescription>
                        </div>
                        <div className="relative w-full md:w-72 group">
                            <Input
                                placeholder="Search URLs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-2">
                    <div className="rounded-none border-t border-border/50 overflow-x-auto">
                        <Table >
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead className="w-[180px] font-bold px-2">Short URL</TableHead>
                                    <TableHead className="hidden md:table-cell font-bold px-2">Original URL</TableHead>
                                    <TableHead className="font-bold px-2">Clicks</TableHead>
                                    <TableHead className="font-bold px-2">Earnings</TableHead>
                                    <TableHead className="hidden md:table-cell font-bold px-2">Created</TableHead>
                                    <TableHead className="text-right font-bold px-2">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody >
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i} className="border-border/50">
                                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredUrls.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <LinkIcon className="w-10 h-10 opacity-20" />
                                                <p>No URLs found. Ready to create your first one?</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {filteredUrls.map((url) => (
                                            <motion.tr
                                                layout
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                key={url.id}
                                                className="group hover:bg-primary/5 transition-colors border-border/50"
                                            >
                                                <TableCell className="font-semibold text-primary">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1 px-2 rounded bg-primary/10 text-xs tracking-wider uppercase">
                                                            /{url.shortUrl}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden max-w-[200px] truncate md:table-cell text-muted-foreground">
                                                    {url.originalUrl}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <MousePointerClick className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                                                        {url.clicks}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-bold text-green-600 dark:text-green-400">
                                                    ${url.earnings ? Number(url.earnings).toFixed(2) : "0.00"}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell text-muted-foreground text-xs font-medium">
                                                    {new Date(url.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                            onClick={() => copyToClipboard(url.shortUrl)}
                                                            title="Copy short URL"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                            asChild
                                                            title="Visit short URL"
                                                        >
                                                            <a href={`/s/${url.shortUrl}`} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40">
                                                                <DropdownMenuItem onClick={() => {
                                                                    setEditingUrl(url)
                                                                    setNewOriginalUrl(url.originalUrl)
                                                                }} className="flex items-center gap-2 cursor-pointer">
                                                                    <Pencil className="h-4 w-4" />
                                                                    <span>Edit Link</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                                                                    onClick={() => deleteUrl(url.shortUrl)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span>Delete Link</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <AnimatePresence>
                {editingUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-background rounded-2xl p-6 shadow-2xl w-full max-w-md border border-border/50 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary"></div>
                            <h3 className="text-xl font-bold mb-4">Edit Destination URL</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Original Destination</label>
                                    <Input
                                        value={newOriginalUrl}
                                        onChange={(e) => setNewOriginalUrl(e.target.value)}
                                        placeholder="https://example.com/..."
                                        className="bg-background/50 border-border/50 h-10"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline" className="h-10 px-6" onClick={() => setEditingUrl(null)}>Cancel</Button>
                                    <Button className="h-10 px-8 shadow-lg shadow-primary/20" onClick={updateUrl}>Save Changes</Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
