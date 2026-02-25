import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/", "/checkout/", "/order-success/"],
      },
    ],
    sitemap: "https://kibanalife.com/sitemap.xml",
    host: "https://kibanalife.com",
  };
}
