import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const candidate = path.join(process.cwd(), 'host', 'vercel-canary.txt');

  try {
    const data = fs.readFileSync(candidate, 'utf8');
    res.status(200).json({
      ok: true,
      candidate,
      data: data.trim(),
    });
  } catch (err) {
    res.status(200).json({
      ok: false,
      candidate,
      error: err && typeof err === 'object' ? err.code || err.message : String(err),
    });
  }
}
