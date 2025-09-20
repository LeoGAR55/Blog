/** @type {import('next').NextConfig} */
const nextConfig = {
  // headers para responder a las requests que vengan https://nextjs.org/docs/pages/api-reference/config/next-config-js/headers
  async headers() {
    return [
      {
        source: "/:path*", // aplica a todas las rutas
        headers: [ // los headers los saque de: https://blog.logrocket.com/using-next-js-security-headers/
          { key: "X-Content-Type-Options", value: "nosniff" },
          //{ key: "Content-Security-Policy", value: "default-src <trusted-domains>" },
          //{ key: "X-Frame-Options:", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), battery=(), geolocation=(), microphone=()" },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin'},
        ],
      },
    ];
  },
};

export default nextConfig;
