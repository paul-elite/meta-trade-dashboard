'use client'

import { Header } from '@/components/dashboard/header'
import { DepositForm } from '@/components/dashboard/deposit-form'

export default function DepositPage() {
  return (
    <div className="min-h-full">
      <Header title="Deposit" description="Add funds to your wallet" />

      <div className="p-6 lg:p-12">
        <DepositForm />
      </div>
    </div>
  )
}
