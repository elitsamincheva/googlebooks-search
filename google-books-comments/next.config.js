/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Extend Webpack configuration to handle GraphQL files and content JSON files
  webpack: (config, options) => {
    // Add a rule to handle GraphQL files using graphql-tag/loader
    config.module.rules.push({
      test: /\.(graphql|gql)/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader"
    });
    // Add a rule to handle content JSON files as assets
    config.module.rules.push({
      test: /\.content.json$/,
      type: "asset/source",
    });
    // Return the modified Webpack configuration
    return config
  }

  
}
// Export the Next.js configuration
module.exports = nextConfig
