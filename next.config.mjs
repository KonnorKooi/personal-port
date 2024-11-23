/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "img.icons8.com",
          port: "",
          pathname: "/**",
        },
      ],
    },
  };
  
  export default nextConfig;