export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export function LoadingSpinnerWithText({
  text = "Carregando...",
}: {
  text?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  );
}
