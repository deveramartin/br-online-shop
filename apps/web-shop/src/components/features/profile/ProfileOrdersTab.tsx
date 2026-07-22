export function ProfileOrdersTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="text-xl font-bold text-gray-900">Order History</h2>
        <p className="text-xs text-[var(--muted)]">Track your recent Ube Jam &amp; Halaya orders.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-low)] border-b border-[var(--border)]">
            <tr>
              <th className="p-3.5 font-semibold text-[var(--muted)]">Order #</th>
              <th className="p-3.5 font-semibold text-[var(--muted)]">Date</th>
              <th className="p-3.5 font-semibold text-[var(--muted)]">Status</th>
              <th className="p-3.5 font-semibold text-[var(--muted)]">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            <tr>
              <td className="p-3.5 font-semibold">BR-89210</td>
              <td className="p-3.5 text-gray-600">Oct 12, 2024</td>
              <td className="p-3.5">
                <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                  Delivered
                </span>
              </td>
              <td className="p-3.5 font-semibold">₱850.00</td>
            </tr>
            <tr>
              <td className="p-3.5 font-semibold">BR-89195</td>
              <td className="p-3.5 text-gray-600">Oct 05, 2024</td>
              <td className="p-3.5">
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                  Shipped
                </span>
              </td>
              <td className="p-3.5 font-semibold">₱1,200.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
