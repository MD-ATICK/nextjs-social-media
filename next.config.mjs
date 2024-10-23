/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  webpack: (config) => {
    config.externals.push("@node-rs/argon2"); // Include server-side external package

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname : `/a/*`
      },
    ],
  },
  rewrites : () => {
    return [
      {
        source: '/hashtag/:tag',
        destination: '/search?q=%23:tag',
      },
    ]
  }
};

export default nextConfig;
