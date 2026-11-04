const BILDUMA_GAKOA = 'bilduma';

class bildumaStorage {
  static denakLortu() {
    const gordetakoData = localStorage.getItem(BILDUMA_GAKOA);

    if(!gordetakoData){
      return [];
    }
    try{
      const datuak = JSON.parse(gordetakoData);
      return Array.isArray(datuak) ? datuak : [];
    }catch{
      return [];
    }
  }

  static gorde(item) {
    let bilduma = this.denakLortu(); 
    //Bilatu, id duplikatuak ekiditeko
    const existitzenDa = bilduma.some(elementua => elementua.id === item.id);
    if (!existitzenDa) {
      //itema objetu bihurtzen dugu
      const objetua = item.toStorageObject();
      bilduma.push(objetua);
      localStorage.setItem(BILDUMA_GAKOA, JSON.stringify(bilduma));
    } else {
      console.log("Joko hau dagoeneko bilduman dago!"); 
    }
  }

  //Bildumako objetua GUZTIAK item bezala itzuli
  static itemBezalaLortu() {
    const bildumaArrunt = this.denakLortu();
    const itemInstantziak = bildumaArrunt.map(obj => Item.fromStorageObject(obj));
    return itemInstantziak;  
  }

  static ezabatu(id) {
    const gordetakoData = this.denakLortu();
    const idBorratzeko = id;
    let dataAldatua = gordetakoData.filter(une => une.id != idBorratzeko);
    localStorage.setItem(BILDUMA_GAKOA, JSON.stringify(dataAldatua));
  }

  static hustu() {
    localStorage.clear();
  }
}
