export class Face {
  /**
   * @type {string}
   */
  static URL = 'url("./assets/oitavos.png")';
  /**
   * @type {number}
   */
  x;
  /**
   * @type {number}
   */
  y;
  /**
   * @type {number}
   */
  width;
  /**
   * @type {number}
   */
  height;
  /**
   * @type {string}
   */
  country;

  /**
   * @param {keyof typeof CountryFaces} face
   */
  constructor(face, jsonData) {
    this.facePosX = jsonData.frames[face].frame.x;
    this.facePosY = jsonData.frames[face].frame.y;

    this.backPosX = jsonData.frames["download.png"].frame.x;
    this.backPosY = jsonData.frames["download.png"].frame.y;

    this.width = jsonData.frames[face].frame.w;
    this.height = jsonData.frames[face].frame.h;

    this.updateBackFace();

    this.country = face.split(".")[0];
  }

  updateFace() {
    this.x = this.facePosX;
    this.y = this.facePosY;
  }

  updateBackFace() {
    this.x = this.backPosX;
    this.y = this.backPosX;
  }
}
