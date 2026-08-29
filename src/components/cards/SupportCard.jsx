export default function SupportCard() {
  return (
    <div className="bg-green-50 rounded-lg p-4 text-center">
      <div className="text-3xl mb-2">🎧</div>
      <div className="font-semibold text-sm text-gray-900 mb-1">Need Help?</div>
      <div className="text-xs text-gray-600 mb-3">
        Our support team is ready to assist you.
      </div>
      <button className="w-full bg-green-600 text-white text-sm py-2 rounded-lg hover:bg-green-700 transition font-medium">
        Contact Support
      </button>
    </div>
  )
}
