export default function errorResponse(res, err) {
  return res.status(500).send({ error: err });
}
