'use client'

import { Header } from '@/components/dashboard/header'
import { WithdrawForm } from '@/components/dashboard/withdraw-form'

export default function WithdrawPage() {
  return (
    <div className="min-h-full">
      <Header title="Withdraw" description="Transfer funds to your bank or card" />

      <div className="p-6 lg:p-12">
        <WithdrawForm />
      </div>
    </div>
  )
}
