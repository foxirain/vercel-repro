import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const hostPath = path.join(process.cwd(), 'host');
  const candidate = path.join(hostPath, 'vercel-canary.txt');

  const out = {
    cwd: process.cwd(),
    hostPath,
    candidate,
    hostExists: fs.existsSync(hostPath),
    candidateExists: fs.existsSync(candidate),
  };

  try {
    const st = fs.lstatSync(hostPath);
    out.hostLstat = {
      isSymbolicLink: st.isSymbolicLink(),
      isDirectory: st.isDirectory(),
      mode: st.mode,
    };
    if (st.isSymbolicLink()) out.hostTarget = fs.readlinkSync(hostPath);
  } catch (e) {
    out.hostError = e && typeof e === 'object' ? e.code || e.message : String(e);
  }

  try {
    out.hostEntries = fs.readdirSync(hostPath).slice(0, 20);
  } catch (e) {
    out.readdirError = e && typeof e === 'object' ? e.code || e.message : String(e);
  }

  try {
    out.data = fs.readFileSync(candidate, 'utf8').trim();
    out.ok = true;
  } catch (e) {
    out.ok = false;
    out.readError = e && typeof e === 'object' ? e.code || e.message : String(e);
  }

  res.status(200).json(out);
}
