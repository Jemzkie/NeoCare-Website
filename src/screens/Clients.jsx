import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../configs/firebase-config";
import Header from "../components/Header";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  /* ───────────────────────── data listener ───────────────────────── */
  useEffect(() => {
    if (!currentUser) {
      console.warn("No doctor logged in.");
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "clients"),
      where("consultantId", "==", currentUser.uid)
    );

    const unsub = onSnapshot(
      q,
      snap => {
        setClients(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      err => {
        console.error("Error fetching clients:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [currentUser, navigate]);

  /* ───────────────────────── UI  ───────────────────────── */
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-[#F2C2DE] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xl text-gray-600">Loading clients…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-[#F2C2DE] flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center pt-20 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Clients</h1>
        <p className="text-center text-gray-700 mb-8 max-w-md">
          Manage your client relationships and view details below.
        </p>

        <section className="w-full max-w-3xl space-y-4">
          {clients.length ? (
            clients.map(c => (
              <div
                key={c.id}
                className="bg-white shadow-md rounded-lg p-6 flex justify-between items-start border-l-4 border-[#DA79B9]"
              >
                {/* left column */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {c.fullName}
                  </h2>
                  <p className="text-sm text-gray-600">{c.email}</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Status:</span> {c.status}
                  </p>
                </div>

                {/* actions */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    onClick={() => navigate(`/clients/${c.id}`)}
                    className="px-4 py-2 rounded-lg bg-[#DA79B9] text-white font-medium hover:bg-[#C064A0] transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/clients/add-consultation-note/${c.id}`)
                    }
                    className="px-4 py-2 rounded-lg border-2 border-[#DA79B9] text-[#DA79B9] font-medium hover:bg-[#FBEAF5] transition"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No clients found. Accept appointment requests to add clients.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Clients;
