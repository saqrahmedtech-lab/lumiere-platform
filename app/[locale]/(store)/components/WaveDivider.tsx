export function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`w-full overflow-hidden leading-none ${flip ? "scale-x-[-1]" : ""}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 680 28"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block w-full h-7"
      >
        <path
          d="M0,14 C80,28 160,0 240,14 C320,28 400,0 480,14 C560,28 640,0 680,14 L680,28 L0,28 Z"
          fill="var(--color-seafoam)"
          fillOpacity="0.5"
        />
        <path
          d="M0,20 C100,8 220,28 340,16 C460,4 580,26 680,18 L680,28 L0,28 Z"
          fill="var(--color-seafoam)"
          fillOpacity="0.28"
        />
      </svg>
    </div>
  );
}
