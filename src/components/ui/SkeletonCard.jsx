export default function SkeletonCard() {
  return (
    <div className="card flex flex-col h-full animate-pulse border-0">
      <div className="aspect-square bg-gray-200 dark:bg-slate-700 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
      <div className="mt-auto flex justify-between items-center">
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
      </div>
    </div>
  );
}
