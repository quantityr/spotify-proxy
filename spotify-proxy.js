export default async function handler(req, res) {
  const target = req.query.url;

  if (!target || !target.startsWith("https://api.spotify.com/")) {
    return res.status(400).json({
      error: "bad_request",
      message: "Only https://api.spotify.com/ URLs are allowed"
    });
  }

  try {
    const spotifyRes = await fetch(target, {
      method: req.method,
      headers: {
        Authorization: req.headers.authorization || ""
      }
    });

    const text = await spotifyRes.text();

    res.status(spotifyRes.status);
    res.setHeader(
      "Content-Type",
      spotifyRes.headers.get("content-type") || "application/json"
    );

    res.send(text);
  } catch (err) {
    res.status(500).json({
      error: "proxy_error",
      message: err.message
    });
  }
}
