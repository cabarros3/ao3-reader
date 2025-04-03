// "use client";
// import { useState } from "react";

// export default function Home() {
//   const [url, setUrl] = useState("");
//   const [fic, setFic] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

//   const fetchFic = async (chapterUrl?: string) => {
//     setLoading(true);
//     setFic(null);

//     try {
//       const apiUrl = `/api/fics?url=${encodeURIComponent(chapterUrl || url)}`;
//       const res = await fetch(apiUrl);
//       const data = await res.json();
//       setFic(data);
//     } catch (error) {
//       setFic({ error: "Erro ao buscar a fanfic" });
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Buscar Fanfic do AO3</h1>

//       <input
//         type="text"
//         placeholder="Cole a URL da fanfic aqui..."
//         value={url}
//         onChange={(e) => setUrl(e.target.value)}
//         className="w-full p-2 border rounded mb-2"
//       />

//       <button
//         onClick={() => fetchFic()}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         disabled={loading}
//       >
//         {loading ? "Buscando..." : "Buscar"}
//       </button>

//       {fic && (
//         <div className="mt-4 p-4 border rounded">
//           {fic.error ? (
//             <p className="text-red-500">{fic.error}</p>
//           ) : (
//             <>
//               <h2 className="text-xl font-bold">{fic.title}</h2>
//               <p>
//                 <strong>Autor:</strong> {fic.author}
//               </p>
//               <p>
//                 <strong>Capítulos:</strong> {fic.chaptersInfo}
//               </p>
//               <p>
//                 <strong>Resumo:</strong> {fic.summary}
//               </p>

//               <h3 className="text-lg font-bold mt-4">Capítulos:</h3>
//               <ul className="list-disc ml-5">
//                 {fic.chapters.map((chapter: any) => (
//                   <li key={chapter.number}>
//                     <button
//                       className="text-blue-500 hover:underline"
//                       onClick={() => fetchFic(chapter.url)}
//                     >
//                       {chapter.number}. {chapter.title}
//                     </button>
//                   </li>
//                 ))}
//               </ul>

//               <h3 className="text-lg font-bold mt-4">Texto do Capítulo:</h3>
//               <div className="border p-4 bg-gray-100 mt-2">
//                 <div dangerouslySetInnerHTML={{ __html: fic.chapterText }} />
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [fic, setFic] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const fetchFic = async (chapterUrl?: string) => {
    setLoading(true);

    try {
      const apiUrl = `/api/fics?url=${encodeURIComponent(chapterUrl || url)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      // Se for a primeira busca, definir os capítulos
      if (!chapterUrl) {
        setFic(data);
        setCurrentChapterIndex(0);
      } else {
        // Apenas atualizar o capítulo, mantendo os capítulos já carregados
        setFic((prevFic: any) => ({
          ...prevFic,
          chapterText: data.chapterText,
        }));
      }
    } catch (error) {
      setFic({ error: "Erro ao buscar a fanfic" });
    }

    setLoading(false);
  };

  // Função para ir para o próximo capítulo
  const nextChapter = () => {
    if (fic && fic.chapters && currentChapterIndex < fic.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      fetchFic(fic.chapters[currentChapterIndex + 1].url);
    }
  };

  // Função para ir para o capítulo anterior
  const prevChapter = () => {
    if (fic && fic.chapters && currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      fetchFic(fic.chapters[currentChapterIndex - 1].url);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buscar Fanfic do AO3</h1>

      <input
        type="text"
        placeholder="Cole a URL da fanfic aqui..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <button
        onClick={() => fetchFic()}
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
                <strong>Capítulos:</strong> {fic.chaptersInfo}
              </p>
              <p>
                <strong>Resumo:</strong> {fic.summary}
              </p>

              <h3 className="text-lg font-bold mt-4">Capítulos:</h3>
              <ul className="list-disc ml-5">
                {fic.chapters.map((chapter: any, index: number) => (
                  <li key={chapter.number}>
                    <button
                      className={`${
                        index === currentChapterIndex
                          ? "font-bold text-blue-700"
                          : "text-blue-500"
                      } hover:underline`}
                      onClick={() => {
                        setCurrentChapterIndex(index);
                        fetchFic(chapter.url);
                      }}
                    >
                      {chapter.number}. {chapter.title}
                    </button>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-bold mt-4">Texto do Capítulo:</h3>
              <div className="border p-4 bg-gray-100 mt-2">
                <div dangerouslySetInnerHTML={{ __html: fic.chapterText }} />
              </div>

              {/* Botões de navegação */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={prevChapter}
                  disabled={currentChapterIndex === 0}
                  className={`px-4 py-2 rounded ${
                    currentChapterIndex === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Anterior
                </button>

                <button
                  onClick={nextChapter}
                  disabled={currentChapterIndex === fic.chapters.length - 1}
                  className={`px-4 py-2 rounded ${
                    currentChapterIndex === fic.chapters.length - 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Próximo
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
