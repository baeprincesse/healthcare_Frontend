import { Plus, Trash2 } from "lucide-react";

export const emptyPrescriptionItem = () => ({
  medicationName: "",
  dosage: "",
  form: "",
  route: "",
  frequency: "",
  duration: "",
  quantity: "",
  instructions: "",
});

export default function PrescriptionEditor({ items, setItems, disabled = false }) {
  const updateItem = (index, field, value) => {
    setItems((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )));
  };

  const removeItem = (index) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 sm:col-span-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-800">Prescription</p>
          <p className="mt-1 text-xs text-slate-500">Add the medicines prescribed during this consultation.</p>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setItems((current) => [...current, emptyPrescriptionItem()])}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
        >
          <Plus size={14} /> Add medication
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-emerald-200 bg-white p-4 text-center text-xs text-slate-500">
            No medication added.
          </p>
        ) : items.map((item, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Medication {index + 1}</p>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeItem(index)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Medication name", "medicationName", "e.g. Paracetamol"],
                ["Dosage", "dosage", "e.g. 500 mg"],
                ["Form", "form", "e.g. Tablet"],
                ["Route", "route", "e.g. Oral"],
                ["Frequency", "frequency", "e.g. 3 times daily"],
                ["Duration", "duration", "e.g. 5 days"],
                ["Quantity", "quantity", "e.g. 15 tablets"],
              ].map(([label, field, placeholder]) => (
                <label key={field} className="block text-xs font-medium text-slate-700">
                  {label}{["medicationName", "dosage", "frequency", "duration"].includes(field) && <span className="text-red-500"> *</span>}
                  <input
                    value={item[field] || ""}
                    onChange={(event) => updateItem(index, field, event.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  />
                </label>
              ))}
              <label className="block text-xs font-medium text-slate-700 sm:col-span-2 lg:col-span-3">
                Instructions
                <textarea
                  value={item.instructions || ""}
                  onChange={(event) => updateItem(index, "instructions", event.target.value)}
                  placeholder="e.g. Take after meals"
                  rows={2}
                  disabled={disabled}
                  className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
