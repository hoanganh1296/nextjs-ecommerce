/* eslint-disable no-param-reassign */
/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  env: {
    BASE_URL: 'https://nextjs-ecommerce-sigma-three.vercel.app',
    MONGODB_URL:
      'mongodb+srv://hoanganh:0977477617@cluster0.oi0yqm4.mongodb.net/next_ecommerce?retryWrites=true&w=majority',
    ACCESS_TOKEN_SECRET: 'U6z8y~~h!c!&AjucB/z[Gr${n_H9**Gjyb&h8>&JwNJB.x=J6)',
    REFRESH_TOKEN_SECRET:
      'ZDqU&XVM84nZbBz2Hbp+ptxp?kpk<nw%!C8GCq=#5^{zrj>?sZ4Z.8E)Vz-xY(8@L[#5adW.T&n~P2A',
    PAYPAL_CLIENT_ID:
      'Aa2HLuG-sECjGOVLSUAAKNSjlJsouiAz7g3APECY5gCL34uLJvcBOcrDNsYrbC-AVdvuaV52UIwIK5jo',
    CLOUD_UPDATE_PRESET: 'nextjs_store',
    CLOUD_NAME: 'dcnxg5hjv',
    CLOUD_API: 'https://api.cloudinary.com/v1_1/dcnxg5hjv/image/upload',
  },
  images: { domains: ['res.cloudinary.com'] },
  webpack: (config) => {
    config.plugins = config.plugins || [];

    config.optimization.providedExports = true;

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
    };

    return config;
  },
};

module.exports = nextConfig;
