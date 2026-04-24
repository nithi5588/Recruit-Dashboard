export function PdfFileIcon({
  size = 40,
  activeDot = false,
}: {
  size?: number;
  activeDot?: boolean;
}) {
  return (
    <span
      aria-hidden
      className="relative flex shrink-0 items-center justify-center rounded-[10px] bg-[#FDECEC] text-[#B91C1C]"
      style={{ width: size, height: size }}
    >
      <svg
        width={Math.round(size * 0.55)}
        height={Math.round(size * 0.55)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M14 3v5h5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="700"
          fill="currentColor"
        >
          PDF
        </text>
      </svg>
      {activeDot ? (
        <span
          aria-label="Active"
          className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#22C55E] text-white"
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12l4 4L19 6"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </span>
  );
}
