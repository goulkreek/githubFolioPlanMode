export default function Loading() {
  return (
    <main className="relative min-h-screen w-full px-6 py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex gap-8 items-center">
          <div className="w-[180px] h-[180px] rounded-full shimmer" />
          <div className="flex-1 space-y-4">
            <div className="h-4 w-32 rounded shimmer" />
            <div className="h-10 w-64 rounded shimmer" />
            <div className="h-4 w-full max-w-xl rounded shimmer" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl shimmer" />
          ))}
        </div>
        <div className="h-[420px] rounded-2xl shimmer" />
      </div>
    </main>
  );
}
