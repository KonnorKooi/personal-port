// Fix for next.config.mjs
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,  // Make sure this is set to true
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;