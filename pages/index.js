import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('/api/stocks');
        if (!response.ok) {
          throw new Error('Failed to fetch stocks');
        }
        const data = await response.json();
        setStocks(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stocks:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  if (loading) return <div className={styles.container}><h1>Loading...</h1></div>;
  if (error) return <div className={styles.container}><h1>Error: {error}</h1></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>上場銘柄一覧</h1>
      <div className={styles.grid}>
        {stocks.map(stock => (
          <div key={stock.Code} className={styles.card}>
            <h2>{stock.Name}</h2>
            <p>コード: {stock.Code}</p>
            <p>市場: {stock.MarketName}</p>
            <p>セクター: {stock.SectorName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}