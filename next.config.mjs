import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        webpackBuildWorker: false,
        parallelServerCompiles: false,
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    webpack: (config, { dev }) => {
        if (!dev) {
            config.cache = false;
        }
        config.ignoreWarnings = [
            { module: /node_modules\/next-intl/ },
            { message: /Build dependencies behind this expression are ignored/ }
        ];
        return config;
    },
};

export default withNextIntl(nextConfig);
