const API_BASE_URL = 'https://www.freetogame.com/api';

async function bilatuApi(generoa, plataforma) {
  const erantzuna = await fetch(
    `${API_BASE_URL}/games?category=${encodeURIComponent(generoa)}&platform=${plataforma}`
  );

  if (!erantzuna.ok) {
    throw new Error(`HTTP errorea: ${erantzuna.status}`);
  }

  const jokoak = await erantzuna.json();

  if (!Array.isArray(jokoak)) {
    throw new Error('APIaren erantzuna ez da jokoen zerrenda bat.');
  }

  return jokoak;
}