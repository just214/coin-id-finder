import Head from "next/head";
export type LayoutProps = {
  children?: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  pageImage?: string;
  pageUrl?: string;
};

const defaultSEO = {
  pageTitle: "Coin ID Finder",
  pageDescription:
    "A handy little tool to find CoinMarketCap and CoinGecko coin IDs for working with their respective APIs.",
  pageImage: "/coin-id-finder-logo.svg",
  pageUrl: "https://www.coin-id-finder.vercel.app",
};

export const Layout = (props: LayoutProps) => {
  const {
    children,
    pageTitle = defaultSEO.pageTitle,
    pageDescription = defaultSEO.pageDescription,
    pageImage = defaultSEO.pageImage,
    pageUrl = defaultSEO.pageUrl,
  } = props;
  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="icon" type="image/png" href={pageImage} sizes="32x32" />
        <link rel="icon" type="image/png" href={pageImage} sizes="16x16" />
        <meta name="application-name" content={pageTitle} />
        <meta name="title" content={pageTitle} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={pageUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={pageImage}></meta>
      </Head>

      <main className="container mx-auto px-2 md:px-32 lg:px-64 xl:px-96 mb-12">
        {children}
      </main>
    </div>
  );
};
