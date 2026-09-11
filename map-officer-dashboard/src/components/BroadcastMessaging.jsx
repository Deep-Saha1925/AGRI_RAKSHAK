import { useEffect, useState } from "react";
import { sendBroadcast, getBroadcastLog, getOfficerCases } from "../api/mockApi";

export default function BroadcastMessaging() {
  const [talukas, setTalukas] = useState([]);
  const [taluka, setTaluka] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [log, setLog] = useState([]);

  useEffect(() => {
    getOfficerCases().then((cases) => {
      const unique = [...new Set(cases.map((c) => c.taluka))].sort();
      setTalukas(unique);
      if (unique.length) setTaluka(unique[0]);
    });
    refreshLog();
  }, []);

  function refreshLog() {
    getBroadcastLog().then(setLog);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!taluka || !message.trim()) return;
    setSending(true);
    await sendBroadcast({ taluka, message: message.trim() });
    setMessage("");
    refreshLog();
    setSending(false);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={handleSend} className="bg-white border border-agri-beige-300 rounded-xl p-6 space-y-4 h-fit">
        <h2 className="text-xl font-bold text-agri-green-800">Broadcast Alert to Farmers</h2>
        <p className="text-sm text-agri-green-600 -mt-2">
          Sends a regional alert to all farmers registered in the selected taluka.
        </p>

        <label className="block text-sm font-medium text-agri-green-800">
          Taluka
          <select
            value={taluka}
            onChange={(e) => setTaluka(e.target.value)}
            className="w-full mt-1 rounded-lg border border-agri-beige-400 bg-agri-beige-50 px-3 py-2 text-sm"
          >
            {talukas.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-agri-green-800">
          Message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="e.g. Pink Bollworm cases rising in your area. Inspect cotton bolls closely and report symptoms early."
            className="w-full mt-1 rounded-lg border border-agri-beige-400 bg-agri-beige-50 px-3 py-2 text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={sending}
          className="bg-agri-green-600 hover:bg-agri-green-700 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send Broadcast"}
        </button>

        <p className="text-xs text-agri-green-500">
          Not wired to a real notification channel yet — contract has no dedicated broadcast
          endpoint. Logged locally for demo purposes; confirm with Person 3 whether this should
          become <span className="font-mono">POST /officer/broadcast/</span> feeding Person 3's
          <span className="font-mono"> /alerts/</span> table.
        </p>
      </form>

      <div className="bg-white border border-agri-beige-300 rounded-xl p-6">
        <h3 className="font-bold text-agri-green-800 mb-3">Recent Broadcasts</h3>
        {log.length === 0 ? (
          <p className="text-sm text-agri-green-500">No broadcasts sent yet.</p>
        ) : (
          <ul className="space-y-3">
            {log.map((entry) => (
              <li key={entry.id} className="border-b border-agri-beige-200 pb-3 last:border-0">
                <p className="text-sm font-medium text-agri-green-800">
                  {entry.taluka} · {entry.recipient_count} farmer{entry.recipient_count !== 1 ? "s" : ""}
                </p>
                <p className="text-sm text-agri-green-700">{entry.message}</p>
                <p className="text-xs text-agri-green-400 mt-1">
                  {new Date(entry.sent_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
