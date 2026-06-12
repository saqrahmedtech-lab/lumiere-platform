import { Product } from "../types/store.types";

export function ProductCard({
  badge,
  badgeBg,
  imgBg,
  icon: Icon,
  iconColor,
  category,
  name,
  sub,
  price,
}: Product) {
  return (
    <div className="relative">
      {badge && (
        <span
          className="absolute top-2 left-2 z-10 text-white rounded-full px-2 py-0.5 text-[9px] font-bold tracking-[0.06em]"
          style={{ background: badgeBg ?? "var(--color-bloom)" }}
        >
          {badge}
        </span>
      )}
      <div className="rounded-xl overflow-hidden bg-pearl border-[0.5px] border-[color-mix(in_srgb,var(--color-drift)_30%,transparent)]">
        {/* image placeholder */}
        <div
          className="flex items-center justify-center h-27.5"
          style={{ background: imgBg }}
        >
          <Icon size={30} color={iconColor} aria-hidden="true" />
        </div>

        {/* body */}
        <div className="px-3 pt-2.5 pb-3">
          <p className="text-xs font-medium uppercase mb-0.5 text-tide tracking-[0.06em] text-[10px]">
            {category}
          </p>
          <p className="font-semibold mb-0.5 text-deep text-[13px]">{name}</p>
          <p className="mb-2 text-text-tertiary text-[11px]">{sub}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-deep text-[14px]">
              {price}{" "}
              <span className="font-normal text-text-tertiary text-[11px]">
                EGP
              </span>
            </span>
            <button className="text-white rounded-lg px-3 py-1 font-medium cursor-pointer bg-bloom text-[11px] border-none">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
