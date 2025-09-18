'use client';
import { useEffect, useState } from "react";

interface Article {
  _id: string;
  title: string;
  shortDescription: string;
  publicationDate: string;
}

export function TestArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Không thể tải dữ liệu bài báo");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Danh sách bài báo</h2>
      <ul>
        {articles.map((article) => (
          <li key={article._id}>
            <strong>{article.title}</strong>
            <div>{article.shortDescription}</div>
            <div>{new Date(article.publicationDate).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
