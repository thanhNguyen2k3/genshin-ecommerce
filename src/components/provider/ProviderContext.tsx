'use client';

import { store } from '@/store';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

type Props = { children: ReactNode };

const ProviderContext = ({ children }: Props) => {
    return (
        <SessionProvider>
            <Provider store={store}>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <SkeletonTheme>{children}</SkeletonTheme>
            </Provider>
        </SessionProvider>
    );
};

export default ProviderContext;
