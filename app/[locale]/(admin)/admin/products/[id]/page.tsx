export default async function AdminProductReviewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { id } = await params
  return <h1 className="text-2xl font-semibold">Product Review: {id}</h1>
}
