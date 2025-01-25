'use client';

export default function RenderPopular() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Popular Albums</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder for Popular Albums */}
        {[1, 2, 3, 4, 5].map((album) => (
          <div
            key={album}
            className="flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-xl"
          >
            <div className="w-64 h-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="text-center">
              <strong className="text-2xl">Album {album}</strong>
              <p className="text-gray-600 mt-2">Artist Name</p>
              <p className="text-sm text-gray-500 mt-2">Release Date: 2025</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
