class Item {
  constructor(ApiDatuak) {
    this.id = ApiDatuak.id;
    this.izena = ApiDatuak.title;
    this.irudia = ApiDatuak.thumbnail;
    this.generoa = ApiDatuak.genre;
    this.plataforma = ApiDatuak.platform

    this.balorazioa = null;
    this.iruzkina = '';
    this.gordetakoData = null;
  }

toHTML() {
    return `
      <div class="item-card" data-id="${this.id}">
        <img src="${this.irudia}" alt="${this.izena}">
        <div class="item-info">
          <h3>${this.izena}</h3>
          <p>Generoa: ${this.generoa}</p>
          <p>Plataforma: ${this.plataforma}</p>
        </div>
      </div>
    `;
  }

toXehetasunHTML() {
    return `
      <div class="item-details">
        <h2>${this.izena}</h2>
        <img src="${this.irudia}" alt="${this.izena}" class="irudi-xehetasuna">
        <p>Generoa: ${this.generoa}</p>
        <p>Plataforma: ${this.plataforma}</p>
        
        <label>Balorazioa (1-5):</label>
        <input type="number" id="item-balorazioa" min="1" max="5" value="${this.balorazioa || ''}">
        
        <label>Iruzkina:</label>
        <textarea id="item-iruzkina">${this.iruzkina}</textarea>
        
        <button id="gehitu-bildumara">Gehitu bildumara</button>
      </div>
    `;
  }
//gero erabiliko dugu, XehatasunHTML + 2 botoi da
  toKudeatuHTML() {
    return `
      <div class="item-card" data-id="${this.id}">
        <img src="${this.irudia}" alt="${this.izena}" class="irudi-txikia">
        <div class="item-info">
          <h3>${this.izena}</h3>
          
          <label>Balorazioa (1-5):</label>
          <input type="number" class="edit-balorazioa" min="1" max="5" value="${this.balorazioa || ''}">
          
          <label>Iruzkina:</label>
          <input type="text" class="edit-iruzkina" value="${this.iruzkina}">
          
          <button class="btn-gorde">Gorde aldaketak</button>
          <button class="btn-ezabatu">Ezabatu</button>
        </div>
      </div>
    `;
  }

  toStorageObject() {
    return {
      id: this.id,
      izena: this.izena,
      irudia: this.irudia,
      generoa: this.generoa,
      plataforma: this.plataforma,
      balorazioa: this.balorazioa,
      iruzkina: this.iruzkina,
      gordetakoData: this.gordetakoData
    };
  }

  static fromStorageObject(obj) {
  const item = new Item({
    id: obj.id,
    title: obj.izena,
    thumbnail: obj.irudia,
    genre: obj.generoa,
    platform: obj.plataforma
  });

  item.balorazioa = obj.balorazioa;
  item.iruzkina = obj.iruzkina;
  item.gordetakoData = obj.gordetakoData;

  return item;
}
}