export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
        <div className="mt-4 text-center">
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    </div>
  );
}
