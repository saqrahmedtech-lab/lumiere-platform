export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // TODO: requireRole('super_admin')
  // const { locale } = await params
  // const user = await getUser()
  // if (user?.role !== 'super_admin') redirect(`/${locale}/auth/login`)

  return (
    <div className="flex min-h-full">
      <aside className="w-64 shrink-0 border-e bg-zinc-950 text-white">
        <div className="flex h-16 items-center px-6 text-lg font-semibold">
          Lumière Admin
        </div>
        <nav className="px-3 py-4">
          {/* Sidebar: dashboard, products, store-products, categories, orders, payments, merchants, reports, settings */}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
