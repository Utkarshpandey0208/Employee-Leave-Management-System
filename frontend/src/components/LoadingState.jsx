export default function LoadingState({ label = "Loading data..." }) {
  return (
    <div className="grid min-h-52 place-items-center rounded-lg border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-300">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        {label}
      </div>
    </div>
  );
}
