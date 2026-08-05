export type Publication = {
  year: string;
  title: string;
  authors: string;
  venue: string;
  link?: string;
};

// Verified against Dae-Ki Kang's own maintained publication list
// (kowon.dongseo.ac.kr/~dkkang/publications.html) and each publisher's
// page directly — 2026-08-05.
export const publications: Publication[] = [
  {
    year: "2026",
    title:
      "Breaking the Fog with SIGHT: Attention-Guided State Prediction for Partially Observable Reinforcement Learning",
    authors: "Limanjaya, L. C., Kang, D.-K.",
    venue: "ACM Transactions on Intelligent Systems and Technology, 17(2), Article 40",
    link: "https://doi.org/10.1145/3787973",
  },
  {
    year: "2025",
    title:
      "From Queries to Courses: SKYRAG's Revolution in Learning Path Generation via Keyword-based Document Retrieval",
    authors: "Soekamto, Y. S., Limanjaya, L. C., Purwanto, Y. K., Kang, D.-K.",
    venue: "IEEE Access, vol. 13, pp. 21434–21455",
    link: "https://doi.org/10.1109/ACCESS.2025.3535618",
  },
  {
    year: "2025",
    title:
      "Pic2Plate: A Vision-Language and Retrieval-Augmented Framework for Personalized Recipe Recommendations",
    authors:
      "Soekamto, Y. S., Lim, A., Limanjaya, L. C., Purwanto, Y. K., Lee, S.-H., Kang, D.-K.",
    venue: "Sensors, 25(2):449, MDPI",
    link: "https://doi.org/10.3390/s25020449",
  },
  {
    year: "2024",
    title:
      "Optimizing Information Retrieval in Dark Web Academic Literature: A Study Using KeyBERT for Keyword Extraction and Clustering",
    authors:
      "Soekamto, Y. S., Limanjaya, L. C., Purwanto, Y. K., Choi, B., Song, S.-K., Kang, D.-K.",
    venue: "IJIBC 16(4)",
    link: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003142439",
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
