"use client";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-12 h-12 border-4 border-[#fdc500] border-t-transparent rounded-full animate-spin" />
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    </div>
  );
}
