export default async function MerchantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // TODO: requireRole('merchant')
  // const { locale } = await params
  // const user = await getUser()
  // if (user?.role !== 'merchant') redirect(`/${locale}/auth/login`)

  return (
    <div className="flex min-h-full">
      <aside className="w-64 shrink-0 border-e bg-zinc-900 text-white">
        <div className="flex h-16 items-center px-6 text-lg font-semibold">
          Lumière Merchant
        </div>
        <nav className="px-3 py-4">
          {/* Sidebar: dashboard, products, orders, reports, settings */}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
