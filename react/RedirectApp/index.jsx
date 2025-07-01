import { useEffect } from 'react';

function RedirectApp() {
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isAndroid = () => /Android/i.test(userAgent) || /\bSilk\b/i.test(userAgent);

        const isIOS = () =>
            /iPhone|iPad|iPod/i.test(userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (isAndroid()) {
            window.location.href = 'https://play.google.com/store/apps/details?id=com.kobe.biostevi';
        } else if (isIOS()) {
            window.location.href = 'https://apps.apple.com/br/app/biost%C3%A9vi-pharma/id6740829799';
        }
    }, []);

    return null;
}

export default RedirectApp;

