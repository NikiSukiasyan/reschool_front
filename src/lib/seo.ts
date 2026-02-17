const BASE_URL = "https://reschool.world";

export const organizationJsonLd = (social?: {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "re:school",
  url: BASE_URL,
  description: "ქართული ციფრული განათლების პლატფორმა — ვებ პროგრამირება, UI/UX დიზაინი, IT პროექტ მენეჯმენტი",
  address: [
    { "@type": "PostalAddress", addressLocality: "თბილისი", addressCountry: "GE" },
    { "@type": "PostalAddress", addressLocality: "ბათუმი", addressCountry: "GE" },
    { "@type": "PostalAddress", addressLocality: "ქუთაისი", addressCountry: "GE" },
  ],
  sameAs: social
    ? Object.values(social).filter(Boolean)
    : [],
});

export const courseJsonLd = (course: {
  title: string;
  description: string;
  slug: string;
  duration: string;
  instructor: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: course.title,
  description: course.description,
  url: `${BASE_URL}/courses/${course.slug}`,
  provider: {
    "@type": "EducationalOrganization",
    name: "re:school",
    url: BASE_URL,
  },
  timeRequired: course.duration,
  instructor: {
    "@type": "Person",
    name: course.instructor,
  },
});

export const articleJsonLd = (article: {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  slug: string;
  image?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.excerpt,
  author: {
    "@type": "Person",
    name: article.author,
  },
  datePublished: article.date,
  url: `${BASE_URL}/blog/${article.slug}`,
  publisher: {
    "@type": "Organization",
    name: "re:school",
    url: BASE_URL,
  },
  ...(article.image ? { image: article.image } : {}),
});

export const breadcrumbJsonLd = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${BASE_URL}${item.url}`,
  })),
});
