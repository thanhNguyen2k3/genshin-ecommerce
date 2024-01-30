import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                header: 'url("/header.webp")',
            },
            width: {
                layout: '1192px',
            },
            colors: {
                primary: '#6eb89f',
                secondary: '#438E44',
                third: '#48b8e5',
                hot: '#E22D2D',
                content: '#545454',
                sub: '#a5a5a5',
                nav: '#777',
            },
        },
    },
    plugins: [],
};
export default config;
