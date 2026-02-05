'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Loader2, GripVertical, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AdminHeader } from '@/components/admin/admin-header'
import type { PromoBanner } from '@/types/database'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<PromoBanner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners')
      if (res.ok) {
        const data = await res.json()
        setBanners(data)
      }
    } catch (err) {
      console.error('Failed to fetch banners:', err)
      setError('Failed to load banners')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError('')
    setSuccess('')

    try {
      // Get current max display order
      const maxOrder = banners.reduce((max, b) => Math.max(max, b.display_order), -1)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Upload file
        const formData = new FormData()
        formData.append('file', file)

        const uploadRes = await fetch('/api/admin/banners/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          const data = await uploadRes.json()
          throw new Error(data.error || 'Upload failed')
        }

        const { image_url, storage_path } = await uploadRes.json()

        // Create banner record
        const createRes = await fetch('/api/admin/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url,
            storage_path,
            display_order: maxOrder + i + 1,
            is_enabled: true,
          }),
        })

        if (!createRes.ok) {
          throw new Error('Failed to create banner record')
        }
      }

      setSuccess(`${files.length} banner(s) uploaded successfully`)
      fetchBanners()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload banners')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const toggleEnabled = async (banner: PromoBanner) => {
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: !banner.is_enabled }),
      })

      if (!res.ok) throw new Error('Failed to update banner')

      setBanners(prev =>
        prev.map(b =>
          b.id === banner.id ? { ...b, is_enabled: !b.is_enabled } : b
        )
      )
    } catch (err) {
      console.error('Toggle error:', err)
      setError('Failed to update banner')
    }
  }

  const updateBanner = async (id: string, updates: Partial<PromoBanner>) => {
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!res.ok) throw new Error('Failed to update banner')

      const updated = await res.json()
      setBanners(prev => prev.map(b => (b.id === id ? updated : b)))
    } catch (err) {
      console.error('Update error:', err)
      setError('Failed to update banner')
    }
  }

  const deleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete banner')

      setBanners(prev => prev.filter(b => b.id !== id))
      setSuccess('Banner deleted')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete banner')
    }
  }

  const moveOrder = async (banner: PromoBanner, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex(b => b.id === banner.id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= banners.length) return

    const targetBanner = banners[targetIndex]

    // Swap display orders
    await Promise.all([
      updateBanner(banner.id, { display_order: targetBanner.display_order }),
      updateBanner(targetBanner.id, { display_order: banner.display_order }),
    ])

    // Refetch to get correct order
    fetchBanners()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Promo Banners"
        description="Manage promotional banners displayed on the user dashboard"
        showBack
        backHref="/admin"
      />

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {/* Upload Section */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="banner-upload"
            />
            <label
              htmlFor="banner-upload"
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-yellow-500/50 transition-colors ${
                isUploading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {isUploading ? (
                <Loader2 className="h-10 w-10 text-zinc-400 animate-spin" />
              ) : (
                <Upload className="h-10 w-10 text-zinc-400" />
              )}
              <p className="mt-4 text-sm text-zinc-400">
                {isUploading ? 'Uploading...' : 'Click to upload images'}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                JPEG, PNG, GIF, WebP (max 5MB each)
              </p>
            </label>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {success}
          </div>
        )}

        {/* Banners List */}
        {banners.length === 0 ? (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-12 text-center text-zinc-400">
              No banners uploaded yet. Upload images above to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {banners.map((banner, index) => (
              <Card
                key={banner.id}
                className={`bg-zinc-900/50 border-zinc-800 ${
                  !banner.is_enabled ? 'opacity-50' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Reorder Controls */}
                    <div className="flex flex-col justify-center gap-1">
                      <button
                        onClick={() => moveOrder(banner, 'up')}
                        disabled={index === 0}
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <GripVertical className="h-4 w-4 rotate-180" />
                      </button>
                      <button
                        onClick={() => moveOrder(banner, 'down')}
                        disabled={index === banners.length - 1}
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Image Preview */}
                    <div className="w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                      <img
                        src={banner.image_url}
                        alt={banner.title || 'Banner'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={banner.title || ''}
                        onChange={(e) => {
                          const newTitle = e.target.value
                          setBanners(prev =>
                            prev.map(b =>
                              b.id === banner.id ? { ...b, title: newTitle } : b
                            )
                          )
                        }}
                        onBlur={(e) => updateBanner(banner.id, { title: e.target.value || null })}
                        placeholder="Banner title (optional)"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50"
                      />
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-zinc-500" />
                        <input
                          type="url"
                          value={banner.link_url || ''}
                          onChange={(e) => {
                            const newUrl = e.target.value
                            setBanners(prev =>
                              prev.map(b =>
                                b.id === banner.id ? { ...b, link_url: newUrl } : b
                              )
                            )
                          }}
                          onBlur={(e) => updateBanner(banner.id, { link_url: e.target.value || null })}
                          placeholder="Link URL (optional)"
                          className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleEnabled(banner)}
                        className={`p-2 rounded-lg transition-colors ${
                          banner.is_enabled
                            ? 'text-green-400 hover:bg-green-500/10'
                            : 'text-zinc-400 hover:bg-zinc-800'
                        }`}
                        title={banner.is_enabled ? 'Disable' : 'Enable'}
                      >
                        {banner.is_enabled ? (
                          <Eye className="h-5 w-5" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
