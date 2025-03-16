import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stocksPerPage] = useState(24);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('/api/stocks');
        if (!response.ok) {
          throw new Error('Failed to fetch stocks');
        }
        const data = await response.json();
        setStocks(data);
        setTotalPages(Math.ceil(data.length / stocksPerPage));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stocks:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStocks();
  }, [stocksPerPage]);

  // ページを変更する関数
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 次のページへ
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 前のページへ
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 現在のページの銘柄を取得
  const getCurrentStocks = () => {
    const indexOfLastStock = currentPage * stocksPerPage;
    const indexOfFirstStock = indexOfLastStock - stocksPerPage;
    return stocks.slice(indexOfFirstStock, indexOfLastStock);
  };

  if (loading) return <div className={styles.container}><h1>Loading...</h1></div>;
  if (error) return <div className={styles.container}><h1>Error: {error}</h1></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>上場銘柄一覧</h1>
      <div className={styles.pageInfo}>
        <p>全 {stocks.length} 銘柄中 {(currentPage - 1) * stocksPerPage + 1} - {Math.min(currentPage * stocksPerPage, stocks.length)} 銘柄を表示</p>
      </div>
      <div className={styles.grid}>
        {getCurrentStocks().map(stock => (
          <div key={stock.Code} className={styles.card}>
            <div className={styles.codeBox}>{stock.Code}</div>
            <h2>{stock.CompanyName}</h2>
            <p className={styles.englishName}>{stock.NameEnglish || "-"}</p>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
        >
          前へ
        </button>
        {Array.from({ length: totalPages }, (_, i) => {
          // 表示するページ番号を制限（現在のページの前後2ページまで表示）
          if (
            i === 0 || // 最初のページ
            i === totalPages - 1 || // 最後のページ
            Math.abs(i + 1 - currentPage) <= 2 // 現在のページの前後2ページ
          ) {
            return (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ''}`}
              >
                {i + 1}
              </button>
            );
          } else if (
            i === currentPage - 4 || // 「...」を表示する位置（前）
            i === currentPage + 2 // 「...」を表示する位置（後）
          ) {
            return <span key={i + 1} className={styles.ellipsis}>...</span>;
          }
          return null;
        })}
        <button 
          onClick={nextPage} 
          disabled={currentPage === totalPages}
          className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        >
          次へ
        </button>
      </div>
    </div>
  );
}