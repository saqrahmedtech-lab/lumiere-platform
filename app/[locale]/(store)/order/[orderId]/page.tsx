export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>
}) {
  const { orderId } = await params
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Order #{orderId}</h1>
    </div>
  )
}
