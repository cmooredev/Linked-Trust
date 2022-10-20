// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.redirect(307, `/trust/${req.body.id}`);
}
