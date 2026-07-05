export type Publication = {
  year: string;
  title: string;
  authors: string;
  venue: string;
  link?: string;
};

export const publications: Publication[] = [
  {
    year: "2026",
    title:
      "Breaking the Fog with SIGHT: Attention-Guided State Prediction for Partially Observable Reinforcement Learning",
    authors: "Limanjaya, L. C., Kang, D.-K.",
    venue: "ACM Transactions on Intelligent Systems and Technology",
  },
  {
    year: "2025",
    title:
      "From Queries to Courses: SKYRAG's Revolution in Learning Path Generation via Keyword-based Document Retrieval",
    authors: "Soekamto, Y. S., Limanjaya, L. C., Purwanto, Y., Kang, D.-K.",
    venue: "IEEE Access",
  },
  {
    year: "2025",
    title:
      "Pic2Plate: A Vision-Language and Retrieval-Augmented Framework for Personalized Recipe Recommendations",
    authors: "Soekamto, Y. S., Lim, A., Limanjaya, L. C., Purwanto, Y., Kang, D.-K.",
    venue: "Sensors, MDPI",
  },
  {
    year: "2024",
    title:
      "Optimizing Information Retrieval in Dark Web Academic Literature: A Study Using KeyBERT for Keyword Extraction and Clustering",
    authors:
      "Soekamto, Y. S., Limanjaya, L. C., Purwanto, Y. K., Choi, B., Song, S.-K., Kang, D.-K.",
    venue: "IJIBC 16(4)",
  },
  {
    year: "2024",
    title:
      "An Empirical Analysis on Reinforcement Learning Algorithms for Stock Trading",
    authors: "Limanjaya, L. C., Kang, D.-K.",
    venue: "ICATI 2024",
  },
  {
    year: "2022",
    title:
      "Sistem Untuk Mengklasifikasikan Emosi Dan Mendeteksi Wajah Pada Pembelajaran Daring",
    authors: "Limanjaya, L. C., Khoswanto, H., Sugiarto, I.",
    venue: "Jurnal Teknik Elektro 15(2)",
    link: "https://jurnalelektro.petra.ac.id/index.php/elk/article/view/25888",
  },
];
