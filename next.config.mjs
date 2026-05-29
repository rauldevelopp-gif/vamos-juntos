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
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    webpack: (config) => {
        config.ignoreWarnings = [
            { module: /node_modules\/next-intl/ },
            { message: /Build dependencies behind this expression are ignored/ }
        ];
        return config;
    },
};

export default withNextIntl(nextConfig);
