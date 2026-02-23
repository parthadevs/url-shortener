"use client"

import { useEffect, useState } from "react"
import { Copy, ExternalLink, LinkIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "../ui/skeleton"

export default function UrlsContent() {
    const { token, user } = useAuth()
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
    const [newCustomSlug, setNewCustomSlug] = useState("")

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


    return (
        <div className="flex flex-col gap-4">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">My URLs</h2>
                <Button>Create New URL</Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl" >Manage Your Short URLs</CardTitle>
                    <CardDescription>View, edit, and track all your shortened URLs</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Input
                            placeholder="Search URLs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm bg-background/50"
                        />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Short URL</TableHead>
                                    <TableHead className="hidden md:table-cell">Original URL</TableHead>
                                    <TableHead>Clicks</TableHead>
                                    <TableHead>Earnings</TableHead>
                                    <TableHead className="hidden md:table-cell">Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    // Skeleton rows while loading
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Skeleton className="h-4 w-32" />
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Skeleton className="h-4 w-48" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-16" />
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Skeleton className="h-8 w-8 rounded" />
                                                    <Skeleton className="h-8 w-8 rounded" />
                                                    <Skeleton className="h-8 w-8 rounded" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredUrls.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            No URLs found. Create your first short URL!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUrls.map((url) => (
                                        <TableRow key={url.id} className="p-4">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <LinkIcon className="h-4 w-4 text-primary" />
                                                    {url.shortUrl}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden max-w-[200px] truncate md:table-cell">{url.originalUrl}</TableCell>
                                            <TableCell>{url.clicks}</TableCell>
                                            <TableCell>${url.earnings ? Number(url.earnings).toFixed(2) : "0.00"}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(url.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => copyToClipboard(url.shortUrl)}
                                                        title="Copy short URL"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                        <span className="sr-only">Copy</span>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild title="Visit short URL">
                                                        <a href={`/s/${url.shortUrl}`} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="h-4 w-4" />
                                                            <span className="sr-only">Visit</span>
                                                        </a>
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">More options</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setEditingUrl(url)} className="flex items-center gap-2">
                                                                <Pencil className="h-4 w-4" />
                                                                <span>Edit</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="flex items-center gap-2 text-destructive focus:text-destructive"
                                                                onClick={() => deleteUrl(url.shortUrl)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span>Delete</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>


            {editingUrl && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
                    <div className="bg-background rounded-lg p-6 shadow-lg w-[90%] max-w-md space-y-4">
                        <h3 className="text-lg font-semibold">Edit Original URL</h3>
                        <Input
                            value={newOriginalUrl}
                            onChange={(e) => setNewOriginalUrl(e.target.value)}
                            placeholder="Update original URL"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditingUrl(null)}>Cancel</Button>
                            <Button onClick={updateUrl}>Save</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
