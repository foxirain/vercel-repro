import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const candidate = path.join(process.cwd(), 'hostfile');

  const out = {
    cwd: process.cwd(),
    candidate,
    candidateExists: fs.existsSync(candidate),
  };

  try {
    const st = fs.lstatSync(candidate);
    out.candidateLstat = {
      isSymbolicLink: st.isSymbolicLink(),
      isDirectory: st.isDirectory(),
      mode: st.mode,
    };
    if (st.isSymbolicLink()) out.candidateTarget = fs.readlinkSync(candidate);
  } catch (e) {
    out.candidateStatError = e && typeof e === 'object' ? e.code || e.message : String(e);
  }

  try {
    out.data = fs.readFileSync(candidate, 'utf8').slice(0, 400);
    out.ok = true;
  } catch (e) {
    out.ok = false;
    out.readError = e && typeof e === 'object' ? e.code || e.message : String(e);
  }

  res.status(200).json(out);
}
