'use client'

import dynamic from 'next/dynamic'

const BankVsInvest = dynamic(() => import('./BankVsInvest'), { ssr: false })

export default BankVsInvest
