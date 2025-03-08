/** @type {import('next').NextConfig} */
import path from "path";
const isDev = process.env.NODE_ENV === "development";
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "styled-components": path.resolve(
        "node_modules/styled-components/dist/styled-components.esm.js"
      ), // alias for styled-components ESM build
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/launchpad-projects",
        permanent: false,
      },
    ];
  },
  transpilePackages: [
    "@usecapsule/rainbowkit-wallet",
    "@usecapsule/rainbowkit",
    "@usecapsule/core-components",
    "@usecapsule/react-components",
    "@usecapsule/react-sdk",
    "@usecapsule/core-sdk",
    "@usecapsule/web-sdk",
    "@usecapsule/wagmi-v2-integration",
    "@usecapsule/viem-v2-integration",
    "@usecapsule/react-common",
    "styled-components",
  ],
};

export default nextConfig;
