export default function HealthTip() {
  return (
    <div className="bg-green-50 rounded-lg border-l-4 border-green-600 p-6">
      <div className="flex gap-4">
        <div className="text-3xl">💪</div>
        <div>
          <h3 className="font-bold text-green-900 mb-2">Stay healthy!</h3>
          <p className="text-sm text-green-800">
            Drink water, eat healthy, and get enough rest. Small habits make a big difference.
          </p>
        </div>
      </div>
    </div>
  )
}
