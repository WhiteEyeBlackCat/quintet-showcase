/** Quiet loading state shown while route params resolve. */
export function DetailSkeleton() {
  return (
    <div className="container-x min-h-dvh pt-[calc(var(--header-h)+3rem)]" aria-busy="true" aria-label="載入專案中">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="flex flex-col gap-5 lg:col-span-5">
          <div className="h-3 w-40 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-14 w-4/5 animate-pulse rounded bg-white/[0.07]" />
          <div className="h-6 w-2/5 animate-pulse rounded bg-white/[0.05]" />
          <div className="mt-4 h-20 w-full animate-pulse rounded bg-white/[0.04]" />
        </div>
        <div className="aspect-[16/10] animate-pulse rounded-xl border border-line bg-panel lg:col-span-7" />
      </div>
    </div>
  );
}
