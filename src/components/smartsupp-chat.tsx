'use client'

import { useEffect } from 'react'

export function SmartsuppChat() {
    useEffect(() => {
        // Skip if already initialized
        if ((window as { smartsupp?: unknown }).smartsupp) {
            return
        }

        // Create the initialization script
        const script = document.createElement('script')
        script.innerHTML = `
      var _smartsupp = _smartsupp || {};
      _smartsupp.key = '9c50b18605aead6f59f657b61beff914a86d346d';
      window.smartsupp||(function(d) {
        var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
        s=d.getElementsByTagName('script')[0];c=d.createElement('script');
        c.type='text/javascript';c.charset='utf-8';c.async=true;
        c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
      })(document);
    `
        document.head.appendChild(script)

        return () => {
            // Cleanup on unmount if needed
            document.head.removeChild(script)
        }
    }, [])

    return null
}
