const PRODUCTS = [
  { id: 1, name: "Coastal Linen Shirt", price: "AED 320", badge: "New" },
  { id: 2, name: "Seafoam Sundress", price: "AED 480", badge: "Best Seller" },
  { id: 3, name: "Pearl Evening Wrap", price: "AED 1,200", badge: "Limited" },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-black px-4 py-28 text-center">
        <span className="mb-4 inline-block rounded-full border border-white/20 px-3 py-1 text-sm font-medium text-white/60">
          Summer 2025
        </span>
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-primary">
          Discover Coastal Luxury
        </h1>
        <p className="mx-auto mb-10 max-w-md text-lg text-zinc-400">
          Curated pieces inspired by sun, salt, and the quiet elegance of the
          sea.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button className="rounded-lg bg-white px-7 py-3 font-semibold text-black transition-colors hover:bg-zinc-200">
            Shop Collection
          </button>
          <button className="rounded-lg border border-white/30 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10">
            Explore Lookbook
          </button>
        </div>
      </section>

      {/* ── Promo Strip ───────────────────────────────────────────────── */}
      <div className="border-y border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-sm">
        <span className="text-zinc-600">
          Free shipping on orders over AED 500 —{" "}
        </span>
        <a
          href="#"
          className="font-semibold text-black underline-offset-2 hover:underline"
        >
          Shop now →
        </a>
      </div>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="bg-zinc-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Featured Pieces
            </h2>
            <a
              href="/shop"
              className="text-sm font-medium text-zinc-500 hover:text-black"
            >
              View all →
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-56 items-center justify-center bg-zinc-100">
                  <span className="text-4xl grayscale">🌊</span>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="font-medium text-zinc-900">
                      {product.name}
                    </h3>
                    <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600">
                      {product.badge}
                    </span>
                  </div>

                  <p className="mb-1 text-sm text-zinc-500">
                    Lumière Collection
                  </p>
                  <p className="mb-4 text-lg font-semibold text-zinc-900">
                    {product.price}
                  </p>

                  <button className="w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Order Status Reference ────────────────────────────────────── */}
      <section className="border-t border-zinc-200 bg-white px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-2 text-2xl font-semibold text-zinc-900">
            Order Status Reference
          </h2>
          <p className="mb-8 text-sm text-zinc-500">
            Remove this section before launch.
          </p>

          <div className="flex flex-wrap gap-3">
            {/* pending_payment */}
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3.5 py-1.5 text-sm font-medium text-zinc-500">
              Pending Payment
            </span>
            {/* payment_review */}
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3.5 py-1.5 text-sm font-medium text-zinc-500">
              Payment Review
            </span>
            {/* confirmed */}
            <span className="inline-flex items-center rounded-full bg-zinc-200 px-3.5 py-1.5 text-sm font-medium text-zinc-700">
              Confirmed
            </span>
            {/* processing */}
            <span className="inline-flex items-center rounded-full bg-zinc-200 px-3.5 py-1.5 text-sm font-medium text-zinc-700">
              Processing
            </span>
            {/* ready */}
            <span className="inline-flex items-center rounded-full bg-zinc-700 px-3.5 py-1.5 text-sm font-medium text-white">
              Ready
            </span>
            {/* shipped */}
            <span className="inline-flex items-center rounded-full bg-zinc-700 px-3.5 py-1.5 text-sm font-medium text-white">
              Shipped
            </span>
            {/* delivered */}
            <span className="inline-flex items-center rounded-full bg-black px-3.5 py-1.5 text-sm font-medium text-white">
              Delivered
            </span>
            {/* cancelled */}
            <span className="inline-flex items-center rounded-full bg-zinc-50 px-3.5 py-1.5 text-sm font-medium text-zinc-400 ring-1 ring-inset ring-zinc-200">
              Cancelled
            </span>
            {/* rejected */}
            <span className="inline-flex items-center rounded-full bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-white">
              Rejected
            </span>
          </div>
        </div>
      </section>

      {/* ── Grayscale Swatch Reference ────────────────────────────────── */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-semibold text-zinc-900">
            Colour Reference
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-300 bg-black p-4">
              <p className="text-sm font-semibold text-white">black</p>
              <p className="mt-0.5 font-mono text-xs text-white/70">#000000</p>
            </div>
            <div className="rounded-xl border border-zinc-300 bg-zinc-900 p-4">
              <p className="text-sm font-semibold text-white">zinc-900</p>
              <p className="mt-0.5 font-mono text-xs text-white/70">#18181b</p>
            </div>
            <div className="rounded-xl border border-zinc-300 bg-zinc-800 p-4">
              <p className="text-sm font-semibold text-white">zinc-800</p>
              <p className="mt-0.5 font-mono text-xs text-white/70">#27272a</p>
            </div>
            <div className="rounded-xl border border-zinc-300 bg-zinc-700 p-4">
              <p className="text-sm font-semibold text-white">zinc-700</p>
              <p className="mt-0.5 font-mono text-xs text-white/70">#3f3f46</p>
            </div>
            <div className="rounded-xl border border-zinc-300 bg-zinc-500 p-4">
              <p className="text-sm font-semibold text-white">zinc-500</p>
              <p className="mt-0.5 font-mono text-xs text-white/70">#71717a</p>
            </div>
            <div className="rounded-xl border border-zinc-300 bg-zinc-300 p-4">
              <p className="text-sm font-semibold text-zinc-900">zinc-300</p>
              <p className="mt-0.5 font-mono text-xs text-zinc-700">#d4d4d8</p>
            </div>
            <div className="rounded-xl border border-zinc-300 bg-zinc-100 p-4">
              <p className="text-sm font-semibold text-zinc-900">zinc-100</p>
              <p className="mt-0.5 font-mono text-xs text-zinc-700">#f4f4f5</p>
            </div>
            <div className="rounded-xl border border-zinc-300 bg-white p-4">
              <p className="text-sm font-semibold text-zinc-900">white</p>
              <p className="mt-0.5 font-mono text-xs text-zinc-700">#ffffff</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Subscribe ─────────────────────────────────────────────────── */}
      <section className="border-t border-zinc-200 bg-white px-4 py-14">
        <div className="mx-auto max-w-md">
          <h2 className="mb-6 text-2xl font-semibold text-zinc-900">
            Subscribe
          </h2>
          <label className="mb-1.5 block text-sm font-medium text-zinc-600">
            Email address
          </label>
          <input
            type="email"
            placeholder="hello@lumiere.ae"
            className="mb-4 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button className="w-full rounded-lg bg-black px-4 py-2.5 font-semibold text-white transition-colors hover:bg-zinc-800">
            Join the List
          </button>
          <p className="mt-3 text-center text-xs text-zinc-400">
            No spam, ever. Unsubscribe any time.
          </p>
        </div>
      </section>
    </>
  );
}
