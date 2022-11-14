import "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/p5.js";
import "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/addons/p5.sound.min.js";

import {LitElement, html, css, classMap} from '/lib/lit.min.js';

class SoundLoop extends LitElement {
  constructor() {
    super();

    this.notes = this.notes || []; 
    this._noteIndex = -1;
  }

  createP5() {
    if (this._p5) return;

    let that = this;

    this._play = false;
    this._p5 = new p5(function (p) {
      p.setup = function () {
        p.noCanvas();

        console.log(this.notes);
        let synth = new p5.MonoSynth();
        that._soundLoop = new p5.SoundLoop((timeFromNow) => {
          var notePattern = that.notes || [];
          if(notePattern.legnth == 0) return;
          let noteIndex = (that._soundLoop.iterations - 1) % notePattern.length;
          that._noteIndex = noteIndex;
          let note = p.midiToFreq(notePattern[noteIndex]);
          console.log(notePattern[noteIndex]);
          synth.play(note, 0.5, timeFromNow);
          // background(noteIndex * 360 / notePattern.length, 50, 100);
        }, 0.2);
        that._soundLoop.start();
      }
    });
  }


  static styles = css`
  button{
    padding: 8px;
    font-size: 28px;
    border-radius: 10px;
    background: transparent;
    border: 2.5px solid black;
  }
  `;

  static properties = {
    notes: {type: Array},
    _play: {type: Boolean},
    // _soundLoop: {type: Object},
    _noteIndex: {state: true},
  };

  switch(){
    if (this._soundLoop.isPlaying) {
      console.log("stoped")
      this._soundLoop.stop();
    } else {
      // start the loop
      console.log("restart");
      this._soundLoop.start();
    }
  }

  disconnectedCallback(){
    super.disconnectedCallback();
    this._soundLoop.stop();
  }

  render(){
    console.log(this.notes);
    this.createP5();
    return html`<div>
      <p>
      loop [ ${ this.notes.map((e,i)=>i==this._noteIndex?html`<u>${e}</u> `:html`${e} `) } ]
      </p>
      <button @click="${this.switch}">Play/Pause</button>
    </div>`;
  }
}

customElements.define("sound-loop", SoundLoop);