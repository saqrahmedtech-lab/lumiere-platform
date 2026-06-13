export default async function AdminMerchantDetailPage({
  params,
}: {
  params: Promise<{ locale: string; merchantId: string }>
}) {
  const { merchantId } = await params
  return <h1 className="text-2xl font-semibold">Merchant: {merchantId}</h1>
}
