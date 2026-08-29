export default function SearchBar(){
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Find the healthcare you need</h3>
      <div className="mt-3 grid gap-1 sm:grid-cols-3">
        <input aria-label="search" placeholder="Search hospitals or doctors" className="sm:col-span-2 rounded-md border px-2 py-2" />
        <div className="flex gap-2">
          <input placeholder="Enter location" className="rounded-md border px-3 py-2 flex-1" />
          <button className="rounded-md bg-green-600 text-white px-4 py-2">Search</button>
        </div>
      </div>
    </div>
  )
}
