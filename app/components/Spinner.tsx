interface SpinnerProps {
  message?: string;
}

export default function Spinner({ message = "Loading..." }: SpinnerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-[9999]">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="mt-5 text-white text-lg font-medium">
        {message}
      </p>
    </div>
  );
}