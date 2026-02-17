import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "re:school";
const BASE_URL = "https://reschool.world";
const DEFAULT_TITLE = "re:school — ციფრული პროფესიების სკოლა | #შენცშეგიძლია";
const DEFAULT_DESC = "ისწავლე ყველაზე მოთხოვნადი ციფრული პროფესიები, მნიშვნელოვნად გაზარდე საკუთარი შემოსავლები და შეიტანე შენი წვლილი გლობალურ-ციფრულ რევოლუციაში. #შენცშეგიძლია";

const SEOHead = ({
  title,
  description = DEFAULT_DESC,
  path = "/",
  type = "website",
  image,
  jsonLd,
}: SEOHeadProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ka_GE" />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Hreflang */}
      <link rel="alternate" hrefLang="ka" href={url} />
      <link rel="alternate" hrefLang="en" href={`${url}${url.includes('?') ? '&' : '?'}lang=en`} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
