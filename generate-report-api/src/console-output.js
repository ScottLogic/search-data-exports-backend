class ConsoleOutput {

  constructor () {
    this._reportBuffer = '';
  }

  append( str ) {
    this._reportBuffer = this._reportBuffer.concat(str);
    console.log(this._reportBuffer);
  }

  close() {
    console.log( this._reportBuffer );
  }
}

module.exports = ConsoleOutput;