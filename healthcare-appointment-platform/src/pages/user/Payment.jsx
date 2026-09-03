import {
  CreditCard,
  Download,
  CheckCircle2,
  Clock3,
  Receipt,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api.js";

const formatAmount = (amount, currency = "XAF") =>
  `${new Intl.NumberFormat("en-US").format(Number(amount) || 0)} ${currency === "XAF" ? "FCFA" : currency}`;

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date))
    : "Date unavailable";

const formatPaymentMethod = (method) => {
  if (method === "MTN_MOMO" || method === "MTN") return "MTN Mobile Money";
  if (method === "ORANGE_MONEY" || method === "ORANGE") return "Orange Money";
  return method || "Payment method unavailable";
};

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api.get("/payments/history")
      .then((response) => {
        if (active) setPayments(response.data?.payments || []);
      })
      .catch(() => {
        if (active) setError("Unable to load your payment history.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const totalPaid = payments
    .filter((payment) => payment.status === "SUCCESS")
    .reduce((total, payment) => total + (Number(payment.amount) || 0), 0);
  const pendingCount = payments.filter((payment) => payment.status === "PENDING").length;

  const downloadReceipt = async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}/receipt`);
      const receipt = new Blob([JSON.stringify(response.data.payment, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(receipt);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payment-receipt-${paymentId}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Unable to download this payment receipt.");
    }
  };

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
                {formatAmount(totalPaid)}
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
                {payments.length}
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
                {pendingCount}
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
                {payments[0] ? formatPaymentMethod(payments[0].paymentMethod) : "No payment method yet"}
              </p>

              <p className="mt-1 text-xs text-emerald-600">
                {payments[0]?.paymentMethod ? "Used for your latest transaction" : "Make a payment to add one"}
              </p>
            </div>

            {payments[0]?.paymentMethod && (
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                Latest
              </span>
            )}

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

          {loading ? (
            <p className="p-5 text-sm text-slate-500">Loading payment history...</p>
          ) : error ? (
            <p className="p-5 text-sm text-red-600">{error}</p>
          ) : payments.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">No payment transactions found.</p>
          ) : payments.map((payment) => (
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
                      {payment.appointment?.doctor?.name
                        ? `Consultation with Dr. ${payment.appointment.doctor.name}`
                        : "Medical payment"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {payment.appointment?.doctor?.specialty || payment.appointment?.consultationType || "Healthcare service"}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {payment.transactionReference || `Payment #${payment.id}`} • {formatDate(payment.paidAt || payment.createdAt)}
                    </p>
                  </div>

                </div>

                <div className="flex items-center justify-between gap-5 md:justify-end">

                  <div className="text-left md:text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {formatAmount(payment.amount, payment.currency)}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {formatPaymentMethod(payment.paymentMethod)}
                    </p>
                  </div>

                  <div>
                    {payment.status === "SUCCESS" ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-600">
                        <CheckCircle2 size={12} />
                        Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1.5 text-[10px] font-semibold text-orange-600">
                        <Clock3 size={12} />
                        {payment.status}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    title="Download receipt"
                    onClick={() => downloadReceipt(payment.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-600"
                  >
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