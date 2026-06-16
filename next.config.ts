import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '127.0.0.1', 'localhost'],
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'gravatar.com'
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com'
			},
			{
				protocol: 'https',
				hostname: '**.public.blob.vercel-storage.com'
			}
		]
	}
}

export default nextConfig
