export default async function handler(req, res) {
  // Verify request is from Vercel Cron
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // ここにcronジョブで実行したいロジックを記述
    console.log('Cron job executed at:', new Date().toISOString());
    
    // 例: データを取得して処理する
    // const data = await fetchSomeData();
    // await processSomeData(data);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Cron job failed:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}