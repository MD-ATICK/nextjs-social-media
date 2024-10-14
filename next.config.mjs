/** @type {import('next').NextConfig} */
const nextConfig = {
    // experimental: {
    //     staleTimes: {
    //         dynamic: 30
    //     }
    // },
    webpack: (config) => {
        config.externals.push('@node-rs/argon2');  // Include server-side external package
    
        return config;
      },
    serverExternalPackages : ['@node-rs/argon2']
};

export default nextConfig;
