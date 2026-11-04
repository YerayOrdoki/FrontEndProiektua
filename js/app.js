const ATALAK = ['hasiera', 'bilatzaile', 'bilduma', 'kudeatuBilduma'];

//
const HASIERATZAILEAK = {
  bilatzaile: hasieratuBilatzailea,
  bilduma: () => { },
  kudeatuBilduma: () => { }
};

function hasieratuBilatzailea() {
  const bilaketa = document.getElementById('form-bilatzaile');
  const egoera = document.getElementById('egoera-bilatzen');
  const emaitzak = document.getElementById('emaitzak-bilaketa');
  const xehetasunak = document.getElementById('xehetasunak-item');

  let bilaketakoItemak = [];

  bilaketa.onsubmit = async function (event) {
    event.preventDefault();

    const generoa = document.getElementById('input-bilaketa').value.trim();

    const plataforma = document.getElementById('select-plataforma').value;

    if (!generoa) {
      egoera.textContent = 'Idatzi bilatu nahi duzun generoa.';
      return;
    }

    egoera.textContent = 'Bilatzen...';
    emaitzak.replaceChildren();
    bilaketakoItemak = [];

    xehetasunak.textContent ='Emaitzetako bat aukeratu, bere xehetasunak bistaratzeko.';

    try {
      const jokoak = await bilatuApi(generoa, plataforma);

      bilaketakoItemak = jokoak.map(function (jokoa) {
        return new Item(jokoa);
      });

      egoera.textContent =`${bilaketakoItemak.length} joko aurkitu dira.`;

      if (bilaketakoItemak.length === 0) {
        emaitzak.textContent = 'Ez da emaitzarik aurkitu.';
        return;
      }

      emaitzak.innerHTML = bilaketakoItemak
        .map(function (item) {
          return item.toHTML();
        }).join('');
    } catch (error) {
      egoera.textContent = 'Errorea bilaketa egitean.';
      console.error(error);
    }
  };

  emaitzak.addEventListener('click', function (event) {
    const txartela = event.target.closest('.item-card');

    if (!txartela) {
      return;
    }

    const hautatutakoItema = bilaketakoItemak.find(function (item) {
      return String(item.id) === txartela.dataset.id;
    });

    if (!hautatutakoItema) {
      return;
    }

    xehetasunak.innerHTML = hautatutakoItema.toXehetasunHTML();
  });
}


async function atalaKargatu(izena) {
  const edukiontzia = document.getElementById(`atala-${izena}`);

  try {
    const emaitza = await fetch(`templates/${izena}.html`);
    if (!emaitza.ok) throw new Error(`${izena} Ezin izan da kargatu`);

    edukiontzia.innerHTML = await emaitza.text();

    if (HASIERATZAILEAK[izena]) HASIERATZAILEAK[izena]();
  } catch (error) {
    edukiontzia.innerHTML = '<p>Atal hau kargatzean errorea suertatu da.</p>';
    console.error(error);
  }
}

function erakutsiAtala(izena) {
  console.log('Erakutsi atala:', izena);
  document.querySelectorAll('.atala').forEach(sec => {
    sec.classList.remove('aktiboa');
  });

  const atala = document.getElementById(`atala-${izena}`);
  console.log('Contenedor encontrado:', atala);

  if (!atala) {
    console.error('No existe el contenedor de la sección:', izena);
    return;
  }

  atala.classList.add('aktiboa');

  console.log('Clases del contenedor:', atala.className);
  console.log('Contenido:', atala.innerHTML);

  document.querySelectorAll('#menu-nagusia button')
    .forEach(btn => btn.classList.remove('active'));

  const boton = document.querySelector(
    `#menu-nagusia button[data-seccion="${izena}"]`
  );

  if (boton) boton.classList.add('active');
}


/*document.querySelectorAll('.atala').forEach(sec => sec.classList.remove('aktiboa'));
document.getElementById(`atala-${izena}`).classList.add('aktiboa');

document.querySelectorAll('#menu-nagusia button').forEach(btn => btn.classList.remove('active'));
const boton = document.querySelector(`#menu-nagusia button[data-seccion="${izena}"]`);
if (boton) boton.classList.add('active');
}*/

async function jaurtiApp() {
  await Promise.all(ATALAK.map(atalaKargatu));
  erakutsiAtala('hasiera');
}

/*document.getElementById('menu-nagusia').addEventListener('click', (event) => {
  const boton = event.target.closest('button[data-seccion]');
  if (!boton) return;
  erakutsiAtala(boton.dataset.seccion);
});*/
document.getElementById('menu-nagusia').addEventListener('click', (event) => {
  console.log('Click detectado');
  const boton = event.target.closest('button[data-seccion]');
  if (!boton) return;

  console.log('Botón pulsado:', boton.dataset.seccion);
  erakutsiAtala(boton.dataset.seccion);
});

jaurtiApp();
