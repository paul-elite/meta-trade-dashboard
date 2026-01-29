'use client'

import { useEffect, useRef, memo } from 'react'

function TradingViewWidgetComponent() {
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Check if script already exists to prevent duplicates on re-renders
        if (container.current && !container.current.querySelector('script')) {
            const script = document.createElement('script')
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js'
            script.type = 'text/javascript'
            script.async = true
            script.innerHTML = JSON.stringify({
                width: '100%',
                height: '100%',
                defaultColumn: 'overview',
                defaultScreen: 'crypto_mkt',
                market: 'crypto',
                showToolbar: true,
                colorTheme: 'dark',
                locale: 'en',
                isTransparent: true,
            })
            container.current.appendChild(script)
        }
    }, [])

    return (
        <div className="tradingview-widget-container w-full h-full" ref={container}>
            <div className="tradingview-widget-container__widget w-full h-full"></div>
        </div>
    )
}

export const TradingViewWidget = memo(TradingViewWidgetComponent)
