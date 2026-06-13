import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gravatar.com',
      },
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
    ],
  },
};

export default nextConfig;
