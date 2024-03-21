import Head from "next/head";
import React from "react";
interface Props {
  title?: string;
  ogUrl?: string;
  description?: string;
  ogImage?: string;
}
export default function HeadMeta({
  title = "JAPAN-SHOP",
  ogUrl = "",
  description="",
  ogImage=""
}: Props) {
  return (
    <Head>
      <title>{`${title} | プラセボのレシピ`}</title>
      <meta property="robots" content="max-image-preview:large" />
      <meta
        property="og:description"
        content={description}
      />
      <meta property="og:title" content={`${title}`} />
      <meta property="og:url" content={`${ogUrl}`} />
      <meta property="og:type" content="article" />
      <meta
        property="og:image"
        content={ogImage}
      />
      <meta property="og:locale" content="ja_JP" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta
        property="twitter:description"
        content={description}
      />
      <meta property="twitter:title" content={`${title}`} />
      <meta property="twitter:url" content={`${ogUrl}`} />
      <meta
        property="twitter:image"
        content={ogImage}
      />
      <meta
        property="description"
        content={description}
      />
      <meta
        property="thumbnail"
        content={ogImage}
      />
    </Head>
  );
}
