class Item {
  constructor(ApiDatuak) {
    this.id = ApiDatuak.id;
    this.izena = ApiDatuak.name;
    this.irudia = ApiDatuak.image;

    this.balorazioa = null;
    this.iruzkina = '';
    this.gordetakoData = null;
  }

  toHTML() {
    return `
      <div class="item-card" data-id="${this.id}">
        <img src="${this.irudia}" alt="${this.izena}">
        <h3>${this.izena}</h3>
      </div>
    `;
  }

  toStorageObject() {
    // TODO
  }

  static fromStorageObject(obj) {
    // TODO
  }
}
