import GetUrlsPage from "@/components/get-urls";
export default async function ShortUrlPage(props: Promise<{ params: { slug: string } }>) {
  const slug = (await props).params.slug;

  return (
    <GetUrlsPage slug={slug} />
  );
}


