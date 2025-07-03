
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    // This is to suppress the harmless warning from handlebars, a dependency of genkit.
    // Webpack 5 doesn't support `require.extensions`, but the code works fine otherwise.
    config.module.exprContextCritical = false;
    return config;
  },
};

export default nextConfig;
