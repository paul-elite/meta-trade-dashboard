'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', balance: 4000 },
  { name: 'Feb', balance: 3000 },
  { name: 'Mar', balance: 5000 },
  { name: 'Apr', balance: 4500 },
  { name: 'May', balance: 6000 },
  { name: 'Jun', balance: 5500 },
  { name: 'Jul', balance: 7000 },
  { name: 'Aug', balance: 6500 },
  { name: 'Sep', balance: 8000 },
  { name: 'Oct', balance: 7500 },
  { name: 'Nov', balance: 9000 },
  { name: 'Dec', balance: 10000 },
]

export function BalanceChart() {
  return (
    <Card className="bg-zinc-900/30 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-200">Balance History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#09090b',
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '0.5rem' }}
                itemStyle={{ color: '#eab308', fontWeight: 600 }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Balance']}
                cursor={{ stroke: '#27272a', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#eab308"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

