import { Metadata } from "next";

export function generateMetadata(
  title: string,
  description: string,
  path: string = "",
): Metadata {
  return {
    title: `${title} | SkillBridge`,
    description,
    openGraph: {
      title: `${title} | SkillBridge`,
      description,
      url: `https://skillbridge.com${path}`,
      siteName: "SkillBridge",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | SkillBridge`,
      description,
      images: ["/og-image.png"],
    },
  };
}
