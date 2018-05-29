// const ytdl = require('ytdl-core');
const state = {
  instruments: [],
  currentID: 0,
  selected: null
}


//CREATING INTERVAL FUNCTIONS AND ONCLICK HANDLERS

falseTimes16Array = () => {
  return "false ".repeat(15).split(" ").map(each => each === "true")
}
falseTimes32Array = () => {
  return "false ".repeat(31).split(" ").map(each => each === "true")
}

(addPlayListener = () => {
  let playButton = document.getElementById("play")
    playButton.addEventListener("click", (e) => {
      Tone.Transport.cancel()
      Tone.Transport.stop()
      Tone.Transport.bpm.value = 120
      state.instruments.forEach((instrument, instrumentIndex) => {
        instrument.notes.forEach((note, noteIndex) => {
          if (note) {
            Tone.Transport.schedule((time) => {
              if (instrument.source === 'tonejs') {
                instrument.note.triggerAttackRelease('C2', '8n', time)
              } else {
                instrument.note.start();
              }
            }, '0:0:'+(noteIndex))
          }
        })
      })
      Tone.Transport.start('+0.1')
    })
})();

(addDefaultInstruments = () => {
  let buttons = document.querySelectorAll(`button[data-type=instrument]`)
  let instruments = document.querySelector('#instruments')
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      state.instruments.push({name: e.target.dataset.name, slug: e.target.dataset.slug, id: state.currentID, source:e.target.dataset.source, note: eval(e.target.dataset.note), notes: falseTimes32Array()})
      renderInstrument(state.currentID, e.target.dataset.name)
      state.currentID++
    })
  })
})();


noteClick = (e) => {
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
  e.stopPropagation()
};

removeInstrument = (id) => {
  let instrumentsToSplice = state.instruments
  let deleted = instrumentsToSplice.find(instrument => instrument.id === parseInt(id))
  let deletedIndex = instrumentsToSplice.findIndex(instrument => instrument.id === parseInt(id))
  let toDelete = document.querySelector(`div[id="${deleted.id}"]`)
  instrumentsToSplice.splice(deletedIndex, 1)
  state.instruments = instrumentsToSplice
  instruments.removeChild(toDelete)

  if (id === state.selected) {
    resetNoteEditor();
  }
}

highlightInstrument = (e) => {
  let node = (["note", "remove"].indexOf(e.target.dataset.type) != -1) ? e.currentTarget : e.target ;
  node.style.backgroundColor = "#C0FFEE";
  node.addEventListener('mouseleave', (e2) => {
    node.style.backgroundColor = "transparent";
      e2.stopPropagation()
    })
  e.stopPropagation();
}

setValue = (e, instrument, sliderType) => {
  instrument.note.envelope[sliderType] = e.target.value
}

addADRS = (instrument) => {
  let settings = document.getElementById("settings")
  let sliders = ["attack", "decay", "release"]
  sliders.forEach((each) => {
    let sliderContainer = document.createElement("div")
    sliderContainer.id = each
    let node = document.querySelector(`div[id="${each}"]`)
    if (node) {
      settings.removeChild(node)
    }
    let label = document.createElement("label")
    label.for = each
    label.innerHTML = each
    let slider = document.createElement("input")
    slider.addEventListener('change', (e) => setValue(e, instrument, each))
    slider.id = instrument.id
    slider.dataset.for = each;
    slider.type = "range";
    slider.min = 0;
    slider.max = 1;
    slider.step = .01;
    slider.value = instrument.note.envelope[each]
    sliderContainer.appendChild(label);
    sliderContainer.appendChild(slider);
    settings.appendChild(sliderContainer);
  })
}

resetNoteEditor = () => {
  let currentNoteEditor = document.getElementById("note-editor");
  let noteEditor = document.createElement("div");
  noteEditor.id = "note-editor";
  let settings = document.createElement("div");
  settings.id = "settings";
  let title = document.createElement("h1");
  title.id = "note-editor-title";
  title.innerHTML = "Edit Notes";
  noteEditor.appendChild(title);
  noteEditor.appendChild(settings);
  currentNoteEditor.innerHTML = noteEditor.innerHTML;
}

showInstrument = (e) => {
  let instrument = state.instruments.find(instrument => parseInt(instrument.id) === parseInt(e.target.id))
  
  if (instrument.slug === "synth") {
    let noteEditorTitle = document.getElementById("note-editor-title")
    noteEditorTitle.innerHTML = `${instrument.name} (id: ${instrument.id})`
    addADRS(instrument);
  } else {
    resetNoteEditor();
  }
  state.selected = e.target.id;
}

renderInstrument = (id, name) => {
  let instruments = document.querySelector('#instruments')
  let instrument = document.createElement("div")
  instrument.addEventListener('click', showInstrument)
  instrument.addEventListener('mouseover', highlightInstrument)
  instrument.id = id
  instrument.setAttribute("style", "display: grid; grid-template-columns: repeat(34, 1fr); grid-gap: 5px; max-height: 50px;")
  let p = document.createElement("p")
  p.id = id
  p.innerHTML = `${name} (id: ${id})`;
  p.style.minWidth = "100px";
  p.style.textAlign = "center";
  instrument.appendChild(p)
  for (let noteID = 0; noteID < 32; noteID++) {
    let note = document.createElement("div");
    note.dataset.type = "note"
    note.id = id + "-" + noteID
    note.style.border = '2px solid black';
    note.addEventListener('click', noteClick)
    instrument.appendChild(note)
  }
  let button = document.createElement("button");
  button.innerHTML = "X"
  button.dataset.type = "remove"
  button.id = id
  button.addEventListener('click', (e) => {
    removeInstrument(e.target.id)
    addPlayListener();
    e.stopPropagation();
  })
  instrument.appendChild(button)
  instruments.appendChild(instrument)
}

