"use client";
import { useState } from "react";

export default function SearchBar() {
  const [url, setUrl] = useState("");
  const [fic, setFic] = useState<{
    title?: string;
    author?: string;
    chapters?: string;
    summary?: string;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFic = async () => {
    if (!url) return;

    setLoading(true);
    setFic(null);

    try {
      const res = await fetch(`/api/fics?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setFic(data);
    } catch (error) {
      setFic({ error: "Erro ao buscar a fanfic" });
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buscar Fanfic do AO3</h1>

      <input
        type="text"
        placeholder="Cole a URL da fanfic aqui..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <button
        onClick={fetchFic}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>

      {fic && (
        <div className="mt-4 p-4 border rounded">
          {fic.error ? (
            <p className="text-red-500">{fic.error}</p>
          ) : (
            <>
              <h2 className="text-xl font-bold">{fic.title}</h2>
              <p>
                <strong>Autor:</strong> {fic.author}
              </p>
              <p>
                <strong>Capítulos:</strong> {fic.chapters}
              </p>
              <p>
                <strong>Resumo:</strong> {fic.summary}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
