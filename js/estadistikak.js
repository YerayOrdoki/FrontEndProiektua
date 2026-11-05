function hasieratuEstatistikak() {
    const bilduma=bildumaStorage.denakLortu();

    const kopuruaElementua=document.getElementById('estatistikak-kopurua');


    //elementu kopurua
    const kopurua=bilduma.reduce((emaitza, elementua) => emaitza + 1, 0);

    kopuruaElementua.textContent=kopurua;

   const batezbestekoaElementua=document.getElementById('estatistikak-batezbestekoa');

   //avg balorazioak
   const balorazioenBatura=bilduma.reduce((emaitza, elementua) => emaitza + (elementua.balorazioa || 0), 0);
    
   if(kopurua>0){
    const batezbestekoa=balorazioenBatura/kopurua;
    batezbestekoaElementua.textContent=batezbestekoa.toFixed(2);
   } else {
    batezbestekoaElementua.textContent='Ez dago baloraziorik';
   }

   const generoakElementua=document.getElementById('estatistikak-generoak');

   generoakElementua.replaceChildren();

   //balorazio bakoitzaren kopurua
   const generoKopuruak=bilduma.reduce((emaitza, elementua) => {
    const generoa=elementua.generoa ||'Generorik gabe';
    const aurrekoKopurua=emaitza.get(generoa)||0;
    emaitza.set(generoa, aurrekoKopurua+1);
    return emaitza;
   }, new Map());

    generoKopuruak.forEach((kopurua, generoa) => {
        const li=document.createElement('li');
        li.textContent=`${generoa}: ${kopurua}`;
        generoakElementua.appendChild(li);
    });

    //Balorazio onena
    const onenaElementua=document.getElementById('estatistikak-onena');
    const onena=bilduma.reduce((onena, elementua) => {
        if(!onena || (elementua.balorazioa || 0) > (onena.balorazioa || 0)){
            return elementua;
        }
        return onena;
    }, null);

    if(onena){
        onenaElementua.textContent=`${onena.izena} (${onena.balorazioa})`;
    } else {
        onenaElementua.textContent='Ez dago baloraziorik';
    }

    //Balorazio txarrena
    const txarrenaElementua=document.getElementById('estatistikak-txarrena');
    const txarrena=bilduma.reduce((txarrena, elementua) => {
        if(!txarrena || (elementua.balorazioa || 0) < (txarrena.balorazioa || 0)){
            return elementua;
        }
        return txarrena;
    }, null);

    if(txarrena){
        txarrenaElementua.textContent=`${txarrena.izena} (${txarrena.balorazioa})`;
    } else {
        txarrenaElementua.textContent='Ez dago baloraziorik';
    }

    
    const egoeraElementua=document.getElementById('egoera-estatistikak');

    egoeraElementua.textContent =
        kopurua === 0 ? 'Oraindik ez duzu jokorik gorde.' : '';


}

//Oroitu apiarekiko funtzio bat sortu behar dela pertsonalizatuta. aldaketatxo