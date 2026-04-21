/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "r2.theaudiodb.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  devIndicators: false
}

export default nextConfig
