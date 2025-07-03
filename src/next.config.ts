
import type {NextConfig} from 'next';
import nextPWA from "@ducanh2912/next-pwa";

const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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

export default withPWA(nextConfig);
