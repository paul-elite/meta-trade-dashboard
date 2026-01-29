'use client'

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { UserTable } from '@/components/admin/user-table'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAdminStore } from '@/store/useAdminStore'
import { Search } from 'lucide-react'

export default function AdminUsersPage() {
  const {
    users,
    isLoading,
    usersTotal,
    searchQuery,
    setUsers,
    setIsLoading,
    setUsersTotal,
    setSearchQuery
  } = useAdminStore()

  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => {
    fetchUsers()
  }, [searchQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch])

  async function fetchUsers() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      console.log('API Response:', data)

      if (response.ok) {
        setUsers(data.users || [])
        setUsersTotal(data.total || 0)
      } else {
        console.error('API Error:', data.error)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Users"
        description={`${usersTotal} total users`}
      />

      <div className="p-8 space-y-8">
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Search by name or email..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <UserTable users={users} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
