import {
  CreditCard,
  Download,
  CheckCircle2,
  Clock3,
  Receipt,
  WalletCards,
} from "lucide-react";

export default function Payment() {
  const payments = [
    {
      id: "PAY-10245",
      service: "Doctor Consultation",
      hospital: "MediCare General Hospital",
      date: "Aug 18, 2026",
      amount: "15,000 FCFA",
      status: "Paid",
      method: "Mobile Money",
    },
    {
      id: "PAY-10231",
      service: "Medical Consultation",
      hospital: "City Medical Center",
      date: "Aug 10, 2026",
      amount: "10,000 FCFA",
      status: "Paid",
      method: "Credit Card",
    },
    {
      id: "PAY-10198",
      service: "Laboratory Test",
      hospital: "MediCare Clinic",
      date: "Aug 05, 2026",
      amount: "25,000 FCFA",
      status: "Pending",
      method: "Mobile Money",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Payments
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your consultation payments and transaction history.
        </p>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <WalletCards size={21} />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Total Paid
              </p>

              <p className="text-xl font-bold text-slate-900">
                50,000 FCFA
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Receipt size={21} />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Transactions
              </p>

              <p className="text-xl font-bold text-slate-900">
                8
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-orange-50 p-3 text-orange-500">
              <Clock3 size={21} />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Pending
              </p>

              <p className="text-xl font-bold text-slate-900">
                1
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Payment methods */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Payment Methods
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your preferred payment options
            </p>
          </div>

          <CreditCard
            size={20}
            className="text-emerald-600"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <div className="flex flex-1 items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">

            <div>
              <p className="text-xs font-semibold text-emerald-700">
                Mobile Money
              </p>

              <p className="mt-1 text-xs text-emerald-600">
                •••• 4589
              </p>
            </div>

            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-600">
              Default
            </span>

          </div>

          <button className="rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-600">
            + Add Payment Method
          </button>

        </div>

      </div>

      {/* Transactions */}
      <div className="rounded-xl bg-white shadow-sm">

        <div className="border-b border-slate-100 p-5">
          <h2 className="font-semibold text-slate-900">
            Transaction History
          </h2>
        </div>

        <div className="divide-y divide-slate-100">

          {payments.map((payment) => (
            <div
              key={payment.id}
              className="p-5 transition hover:bg-slate-50"
            >

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="flex gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Receipt size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {payment.service}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {payment.hospital}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {payment.id} • {payment.date}
                    </p>
                  </div>

                </div>

                <div className="flex items-center justify-between gap-5 md:justify-end">

                  <div className="text-left md:text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {payment.amount}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {payment.method}
                    </p>
                  </div>

                  <div>
                    {payment.status === "Paid" ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-600">
                        <CheckCircle2 size={12} />
                        Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1.5 text-[10px] font-semibold text-orange-600">
                        <Clock3 size={12} />
                        Pending
                      </span>
                    )}
                  </div>

                  <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-600">
                    <Download size={17} />
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}