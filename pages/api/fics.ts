// import type { NextApiRequest, NextApiResponse } from "next";
// import axios from "axios";
// import * as cheerio from "cheerio";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { url } = req.query;

//   if (!url || typeof url !== "string") {
//     return res.status(400).json({ error: "URL da fanfic é obrigatória" });
//   }

//   try {
//     const { data } = await axios.get(url, {
//       headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
//     });

//     const $ = cheerio.load(data);

//     // Pegando as informações da fanfic
//     const title = $("h2.title").text().trim();
//     const author = $("a[rel='author']").text().trim();
//     const chapters = $("dd.chapters").text().trim();
//     const summary = $("blockquote.userstuff").first().text().trim();

//     res.status(200).json({ title, author, chapters, summary });
//   } catch (error) {
//     res.status(500).json({ error: "Erro ao buscar a fanfic" });
//   }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL da fanfic é obrigatória" });
  }

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    const $ = cheerio.load(data);

    // Pegando as informações da fanfic
    const title = $("h2.title").text().trim();
    const author = $("a[rel='author']").text().trim();
    const chaptersInfo = $("dd.chapters").text().trim();
    const summary = $("blockquote.userstuff").first().text().trim();

    // Pegando os capítulos
    const chapters: { number: number; title: string; url: string }[] = [];
    $("ol.index a").each((index, element) => {
      const chapterTitle = $(element).text().trim();
      const chapterUrl =
        "https://archiveofourown.org" + $(element).attr("href");
      chapters.push({
        number: index + 1,
        title: chapterTitle,
        url: chapterUrl,
      });
    });

    // Pegando o texto do capítulo atual
    const chapterText = $("div.userstuff").html()?.trim() || "";

    res
      .status(200)
      .json({ title, author, chaptersInfo, summary, chapters, chapterText });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a fanfic" });
  }
}
