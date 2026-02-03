'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Mail, Save, CheckCircle2, XCircle, Settings, MessageCircle, Send } from 'lucide-react'

interface SiteSettings {
    id?: string
    whatsapp: string
    telegram: string
    email: string
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        whatsapp: '',
        telegram: '',
        email: '',
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings')
            if (response.ok) {
                const data = await response.json()
                setSettings(data)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)

        const loadingToast = toast.loading(
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Settings className="h-4 w-4 text-yellow-500" />
                </div>
                <div>
                    <p className="font-medium">Saving settings...</p>
                </div>
            </div>
        )

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            })

            if (!response.ok) {
                throw new Error('Failed to save settings')
            }

            const data = await response.json()
            setSettings(data)

            toast.dismiss(loadingToast)
            toast.success(
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-green-400">Settings Saved!</p>
                        <p className="text-xs text-zinc-400 mt-1">Contact information updated successfully</p>
                    </div>
                </div>,
                { duration: 4000 }
            )
        } catch (error) {
            toast.dismiss(loadingToast)
            toast.error(
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-red-400">Failed to Save</p>
                        <p className="text-xs text-zinc-400 mt-1">{error instanceof Error ? error.message : 'Please try again'}</p>
                    </div>
                </div>,
                { duration: 4000 }
            )
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="p-4 lg:p-8">
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Site Settings</h1>
                <p className="text-zinc-400">Manage contact information and site configuration</p>
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-yellow-500" />
                        Contact Channels
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Configure your WhatsApp, Telegram, and Email contact details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* WhatsApp */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp Number
                        </label>
                        <Input
                            placeholder="+1234567890"
                            value={settings.whatsapp}
                            onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                            className="bg-zinc-900 border-zinc-800 text-white"
                        />
                        <p className="text-xs text-zinc-500">Enter your WhatsApp number with country code (e.g., +1234567890)</p>
                    </div>

                    {/* Telegram */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <Send className="h-4 w-4 text-blue-400" />
                            Telegram Username
                        </label>
                        <Input
                            placeholder="@username or https://t.me/username"
                            value={settings.telegram}
                            onChange={(e) => setSettings({ ...settings, telegram: e.target.value })}
                            className="bg-zinc-900 border-zinc-800 text-white"
                        />
                        <p className="text-xs text-zinc-500">Enter your Telegram username or link</p>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <Mail className="h-4 w-4 text-yellow-500" />
                            Email Address
                        </label>
                        <Input
                            type="email"
                            placeholder="support@example.com"
                            value={settings.email}
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            className="bg-zinc-900 border-zinc-800 text-white"
                        />
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            isLoading={isSaving}
                            leftIcon={<Save className="h-4 w-4" />}
                            className="w-full sm:w-auto"
                        >
                            Save Settings
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Preview Card */}
            <Card className="bg-zinc-900/30 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-zinc-300 text-sm">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                        <p className="text-sm text-zinc-400 mb-3">This is how your contact info will appear:</p>
                        <div className="space-y-3 text-sm">
                            {settings.whatsapp && (
                                <a
                                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-zinc-300 hover:text-green-500 transition-colors"
                                >
                                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    <span>WhatsApp: {settings.whatsapp}</span>
                                </a>
                            )}
                            {settings.telegram && (
                                <a
                                    href={settings.telegram.startsWith('http') ? settings.telegram : `https://t.me/${settings.telegram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-zinc-300 hover:text-blue-400 transition-colors"
                                >
                                    <Send className="h-4 w-4 text-blue-400" />
                                    <span>Telegram: {settings.telegram}</span>
                                </a>
                            )}
                            {settings.email && (
                                <a
                                    href={`mailto:${settings.email}`}
                                    className="flex items-center gap-2 text-zinc-300 hover:text-yellow-500 transition-colors"
                                >
                                    <Mail className="h-4 w-4 text-yellow-500" />
                                    <span>Email: {settings.email}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
