const ATALAK = ['hasiera', 'bilatzaile', 'bilduma', 'kudeatuBilduma','estatistikak'];

const HASIERATZAILEAK = {
  bilatzaile: hasieratuBilatzailea,
  bilduma: hasieratuBilduma,
  kudeatuBilduma: hasieratuKudeatuBilduma,
  estatistikak: hasieratuEstatistikak
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
    const gordeBotoia=document.getElementById('gehitu-bildumara');

    gordeBotoia.addEventListener('click', function () {
      const balorazioa=Number(document.getElementById('item-balorazioa').value);

      const iruzkina=document.getElementById('item-iruzkina').value.trim();

       if (!Number.isInteger(balorazioa) || balorazioa < 1 || balorazioa > 5) {
        egoera.textContent = 'Balorazioak 1 eta 5 arteko zenbaki osoa izan behar du.';
        return;
      }
      
      try {
        const bilduma = bildumaStorage.denakLortu();

        const existitzenDa = bilduma.some(function (item) {
          return String(item.id) === String(hautatutakoItema.id);
        });

        if (existitzenDa) {
          egoera.textContent = 'Joko hau dagoeneko bilduman dago.';
          return;
        }

        hautatutakoItema.balorazioa = balorazioa;
        hautatutakoItema.iruzkina = iruzkina;
        hautatutakoItema.gordetakoData = new Date().toISOString();

        bildumaStorage.gorde(hautatutakoItema);

        egoera.textContent = 'Jokoa bilduman gorde da.';

      } catch (error) {
        egoera.textContent = 'Errorea jokoa gordetzean.';
        console.error(error);
      } finally{
        document.getElementById('item-balorazioa').value = '';
        document.getElementById('item-iruzkina').value = '';
        xehetasunak.textContent = 'Emaitzetako bat aukeratu, bere xehetasunak bistaratzeko.';
      }

      
    });
  });
}

//Bildumaren hasierakea 

function hasieratuBilduma() {

  //bilduma.html ko elementuak lortzen ditugu
  const edukiontzia = document.getElementById('lista-bilduma');
  const panela = document.getElementById('xehetasun-bilduma');
  const btnIragazi = document.getElementById('btn-iragazi');
  const btnOrdenatu = document.getElementById('btn-ordenatu');

  function bildumaKargatuEtaErakutsi() {
    let bildumaOsoa = bildumaStorage.itemBezalaLortu();

    //.filter
    const inputFiltro = document.getElementById('input-filtroa');
    if (inputFiltro) {
      const iragazkiTestua = inputFiltro.value.toLowerCase().trim();
      if (iragazkiTestua) {
        bildumaOsoa = bildumaOsoa.filter(item => item.generoa.toLowerCase() === iragazkiTestua);
      }
    }

    // .sort
    const selectOrden = document.getElementById('select-ordena');
    if (selectOrden) {
      const ordenazioa = selectOrden.value;
      bildumaOsoa.sort((a, b) => {
        if (ordenazioa === 'balorazioa-desc') return (b.balorazioa || 0) - (a.balorazioa || 0);
        if (ordenazioa === 'balorazioa-asc') return (a.balorazioa || 0) - (b.balorazioa || 0);
      });
    }

    if (bildumaOsoa.length === 0) {
      edukiontzia.innerHTML = '<p>Ez dago emaitzarik.</p>';
    } else {
      //join('') jartzen dugu bestela "," ateratzen delako
      edukiontzia.innerHTML = bildumaOsoa.map(item => item.toHTML()).join('');
      
      const txartelak = edukiontzia.querySelectorAll('.item-card');
      txartelak.forEach((txartela, indizea) => {
        txartela.addEventListener('click', () => {
          //videojokoaren Xehetasunak erakusten ditugu
          panela.innerHTML = bildumaOsoa[indizea].toXehetasunHTML();
          
          //"Gehitu bildumara" botoia ezkudatu jokua bilduman badago
          const botoia = panela.querySelector('#gehitu-bildumara');
          if (botoia) botoia.style.display = 'none';
        });
      });
    }
  }

  //Botoiei gertaerak lotu
  if (btnIragazi){ 
    btnIragazi.addEventListener('click', bildumaKargatuEtaErakutsi)
  };
  if (btnOrdenatu){ 
    btnOrdenatu.addEventListener('click', bildumaKargatuEtaErakutsi)
  };

  //Funtzioa exekutatu atala kargatzean
  bildumaKargatuEtaErakutsi();
}

function kudeatuKargatuEtaErakutsi() {
  const edukiontzia = document.getElementById('lista-kudeatu');
  
  if (!edukiontzia) return; //Funtzioa beste atal batean ustekabean exekutatzen bada erroreak saihesteko

  const bildumaOsoa = bildumaStorage.itemBezalaLortu();
  
  if (bildumaOsoa.length === 0) {
    edukiontzia.innerHTML = '<p>Oraindik ez du item-ik gorde.</p>';
  } else {
    //to kudeatu funtzio bereizia deitzen dugu botoi guztiak eskuratzeko
    edukiontzia.innerHTML = bildumaOsoa.map(item => item.toKudeatuHTML()).join('');
    
    //Ezabatu botoiak (1 joku bakoitzarrentzako)
    const ezabatuBotoiak = edukiontzia.querySelectorAll('.btn-ezabatu');
    ezabatuBotoiak.forEach((botoia, indizea) => {
      botoia.addEventListener('click', () => {
        const idAukeratua = bildumaOsoa[indizea].id;
        if(confirm('Ziur zaude bildumatik bideojokoa kendu nahi duzula?')){
          bildumaStorage.ezabatu(idAukeratua);
        }
        //Zerrenda berria kargatu
        kudeatuKargatuEtaErakutsi();
      });
    });

    //Gorde botoia (1 joku bakoitzarentzat)
    const gordeBotoiak = edukiontzia.querySelectorAll('.btn-gorde');
    gordeBotoiak.forEach((botoia, indizea) => {
      botoia.addEventListener('click', () => {
        const txartelak = edukiontzia.querySelectorAll('.item-card');
        const txartela = txartelak[indizea];
        const balorazioaBerria = txartela.querySelector('.edit-balorazioa').value;
        const iruzkinaBerria = txartela.querySelector('.edit-iruzkina').value;
        
        const jokoa = bildumaOsoa[indizea];
        jokoa.balorazioa = balorazioaBerria;
        jokoa.iruzkina = iruzkinaBerria;
        
        bildumaStorage.eguneratu(jokoa);
        alert('Aldaketak gorde dira!');
      });
    });
  }
}

//Hasieratu
function hasieratuKudeatuBilduma() {
  const hustuBotoia = document.getElementById('botoia-hustu');

  //Bilduma osoa husteko botoiaren gertaera
  if (hustuBotoia) {
    hustuBotoia.onclick = function() {
      if (confirm('Ziur zaude bilduma osoa ezabatu nahi duzula?')) {
        bildumaStorage.hustu();
        kudeatuKargatuEtaErakutsi(); //Zerrenda hutsa erakusteko berriro kargatu
      }
    };
  }
  //Funtzio independentea deitu zerrenda marrazteko
  kudeatuKargatuEtaErakutsi();
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
