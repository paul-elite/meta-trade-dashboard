'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Phone, Mail, Clock, MapPin, Save, CheckCircle2, XCircle, Settings } from 'lucide-react'

interface SiteSettings {
    id?: string
    phone_number: string
    email: string
    support_hours: string
    address: string
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        phone_number: '',
        email: '',
        support_hours: '24/7',
        address: '',
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
                        <Phone className="h-5 w-5 text-yellow-500" />
                        Contact Information
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        This information will be displayed in the footer and contact sections of the website
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <Phone className="h-4 w-4 text-zinc-500" />
                            Phone Number
                        </label>
                        <Input
                            placeholder="+1 (555) 123-4567"
                            value={settings.phone_number}
                            onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
                            className="bg-zinc-900 border-zinc-800 text-white"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <Mail className="h-4 w-4 text-zinc-500" />
                            Support Email
                        </label>
                        <Input
                            type="email"
                            placeholder="support@example.com"
                            value={settings.email}
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            className="bg-zinc-900 border-zinc-800 text-white"
                        />
                    </div>

                    {/* Support Hours */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <Clock className="h-4 w-4 text-zinc-500" />
                            Support Hours
                        </label>
                        <Input
                            placeholder="24/7"
                            value={settings.support_hours}
                            onChange={(e) => setSettings({ ...settings, support_hours: e.target.value })}
                            className="bg-zinc-900 border-zinc-800 text-white"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <MapPin className="h-4 w-4 text-zinc-500" />
                            Address (optional)
                        </label>
                        <Input
                            placeholder="123 Main St, City, Country"
                            value={settings.address}
                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
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
                        <div className="space-y-2 text-sm">
                            {settings.phone_number && (
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <Phone className="h-4 w-4 text-yellow-500" />
                                    <span>{settings.phone_number}</span>
                                </div>
                            )}
                            {settings.email && (
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <Mail className="h-4 w-4 text-yellow-500" />
                                    <span>{settings.email}</span>
                                </div>
                            )}
                            {settings.support_hours && (
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <Clock className="h-4 w-4 text-yellow-500" />
                                    <span>{settings.support_hours}</span>
                                </div>
                            )}
                            {settings.address && (
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <MapPin className="h-4 w-4 text-yellow-500" />
                                    <span>{settings.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
