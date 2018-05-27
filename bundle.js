(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// const ytdl = require('ytdl-core');
// const Tone = require('tone');
const state = {
  instruments: [],
  beatNumber: 0,
  currentID: 0
}


//CREATING INTERVAL FUNCTIONS AND ONCLICK HANDLERS

  render = function (template, node) {
    if (!node) return;
    node.innerHTML = (typeof template === 'function' ? template() : template);
    var event = new CustomEvent('elementRenders', {
      bubbles: true
    });
    node.dispatchEvent(event);
    return node;
  };
  document.addEventListener('elementRendered', function (event) {
    var elem = event.target;
  }, false);

falseTimes16Array = () => {
  return "false ".repeat(15).split(" ").map(each => each === "true")
}
falseTimes32Array = () => {
  return "false ".repeat(31).split(" ").map(each => each === "true")
}

(addPlayListener = () => {
  console.log('adding')
  let playButton = document.getElementById("play")
    playButton.addEventListener("click", (e) => {
      console.log('playing')          
      Tone.Transport.cancel()
      Tone.Transport.stop()
      Tone.Transport.bpm.value = 120
      state.instruments.forEach((instrument, instrumentIndex) => {
        instrument.notes.forEach((note, noteIndex) => {
          if (note) {
            Tone.Transport.schedule((time) => {
              console.log(time)
              if (instrument.source === 'tonejs') {
                instrument.note.triggerAttackRelease('C2', '8n', time)
              } else {
                console.log(instrument.note)
                instrument.note.start();
              }
            }, '0:0:'+(noteIndex))
          }
        })
      })
      Tone.Transport.start('+0.1')
    })
})();


function noteClick (e) {
  console.log(e.target)
  let instruments = state.instruments
  instruments.forEach((instrument, instrumentIndex) => {
    instrument.notes.forEach((noteBoolean, noteIndex) => {
      if (instrument.id + '-' + noteIndex === e.target.id) {
        let note = document.getElementById(instrument.id + "-" + noteIndex);
        note.style.backgroundColor = !noteBoolean ? '#6500a0' : 'transparent';
        instruments[instrumentIndex].notes[noteIndex] = !instruments[instrumentIndex].notes[noteIndex]
        state.instruments = instruments
      }
    })
  })
};

renderInstrument = (id, name) => {
  let instruments = document.querySelector('#instruments')
  let instrument = document.createElement("div")
  instrument.id = id
  instrument.setAttribute("style", "display: grid; grid-template-columns: repeat(34, 1fr); grid-gap: 5px; max-height: 50px;")
  let p = document.createElement("p")
  p.innerHTML = name;
  p.style.minWidth = "100px";
  p.style.textAlign = "center";
  instrument.appendChild(p)
  for (let noteID = 0; noteID < 32; noteID++) {
    let note = document.createElement("div");
    note.id = id + "-" + noteID
    note.style.border = '2px solid black';
    note.addEventListener('click', noteClick)
    instrument.appendChild(note)
  }
  let button = document.createElement("button");
  button.innerHTML = "X"
  button.dataset.type = "remove"
  button.dataset.id = id
  button.addEventListener('click', (e) => {
    let deletedID = state.instruments.findIndex(instrument => instrument.id === parseInt(e.target.dataset.id))
    let toDelete = document.querySelector(`div[id="${deletedID}"]`)
    instruments.removeChild(toDelete)
  })
  instrument.appendChild(button)
  instruments.appendChild(instrument)
}

addInstrumentListener = () => {
  let buttons = document.querySelectorAll(`button[data-type=instrument]`)
  let instruments = document.querySelector('#instruments')
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      console.log(e.target.value)
      state.instruments.push({name: e.target.name, id: state.currentID, source:e.target.dataset.source, note: eval(e.target.dataset.note), notes: falseTimes32Array()})
      renderInstrument(state.currentID, e.target.dataset.name)
      state.currentID++
    })
  })
}
addInstrumentListener();

/*

TODO: Cancel notes in transport when row is deleted


*/
},{}]},{},[1]);
