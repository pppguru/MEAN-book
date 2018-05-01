import path from 'path';
import fs from 'fs';

export async function template(req, res) {
     const filePath = path.join(__dirname, `../../template/export/Bookis_template${JSON.parse(req.query.full) ? '_full' : ''}.xlsx`);
     res.download(filePath);
}

export async function invalids(req, res) {
     const filePath = path.join(__dirname, `../../..${req.query.link}`);
     res.download(filePath, () => {
          fs.unlink(filePath);
     });
}
