import React, { useEffect } from 'react';

const CartOpenerScript = () => {
    useEffect(() => {
        const openMinicart = () => {
            const minicartButton = document.querySelector('.vtex-minicart-2-x-openIconContainer button, .vtex-minicart-2-x-minicartContainer button, [data-testid="minicart-open-button"]');

            if (minicartButton) {
                minicartButton.click();
                return true;
            } else {
                const minicartContainer = document.querySelector('.vtex-minicart-2-x-minicartContainer, .vtex-minicart-2-x-minicartWrapperContainer');
                if (minicartContainer) {
                    minicartContainer.click();
                    return true;
                } else {
                    return false;
                }
            }
        };

        const monitorDataLayer = () => {
            window.dataLayer = window.dataLayer || [];

            const originalPush = window.dataLayer.push;

            window.dataLayer.push = function (event) {
                const result = originalPush.apply(this, arguments);

                if (event && typeof event === 'object') {
                    console.log('📊 DataLayer Event:', event);

                    const isAddToCartEvent =
                        event.event === 'add_to_cart' ||
                        event.event === 'addToCart';

                    if (isAddToCartEvent) {
                        setTimeout(() => {
                            openMinicart();
                        }, 500);
                    }
                }

                return result;
            };
        };

        const monitorGTMEvents = () => {
            document.addEventListener('gtm.dom', (e) => {
                console.log('📊 GTM DOM Event:', e);
            });

            const addToCartEvents = [
                'add_to_cart',
                'addToCart'
            ];

            addToCartEvents.forEach(eventName => {
                document.addEventListener(eventName, (e) => {
                    setTimeout(() => {
                        openMinicart();
                    }, 300);
                });
            });
        };

        monitorDataLayer();
        monitorGTMEvents();

        return () => {
        };
    }, []);

    return (
        <meta id="cart-opener-script-loaded"/>
    );
};

export default CartOpenerScript;
