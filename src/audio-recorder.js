import '../node_modules/@dannymoerkerke/material-webcomponents/src/material-button.js';
import '../node_modules/@dannymoerkerke/material-webcomponents/src/material-slider.js';

export class AudioRecorder extends HTMLElement {

  static get observedAttributes() {
    return ['view'];
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});

    shadowRoot.innerHTML = `
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      
      <style>
        :host {
          --width: 210px;
          --height: 300px;
          --border: none;
          --frequency-background-color: #ffffff;
          --frequency-bars-color: #ff0000;
          --waveform-background-color: #ffffff;
          --waveform-color: #ff0000;
          --waveform-progress-color: #337ab7;
          display: inline-flex;
          flex-direction: column;
          border: var(--border);
          box-sizing: content-box;
          min-width: 210px;
          width: var(--width);
          min-height: var(--height);
        }
        
        canvas {
          display: block;
        }
        
        material-slider {
          --track-height: 1px;
          --thumb-size: 12px;
        }
        
        #volume-min,
        #volume-max {
          --button-color-hover: transparent;
        }
        
        #buttons {
          display: flex;
          flex-direction: row;
        }
        
        #controls {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          padding: 5px 10px 5px 5px;
          max-width: 800px;
        }
        
        #time {
          display: flex;
          align-items: center;
          padding: 5px;
        }
        
        #volume-container {
          display: flex;
          align-items: center;
        }
        
        #container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        
        #audio-container {
          position: relative;
          flex-grow: 1;
        }
        
        #waveform-container,
        #frequencies-container {
          display: none;
        }
        
        #waveform-container {
          background-color: var(--waveform-background-color);
        }
        
        #frequencies-container {
          z-index: 1;
          background-color: var(--frequency-background-color);
        }
        
        :host([view="frequencies"]) #frequencies-container {
          display: block;
        }
        
        :host([view="frequencies"]) #frequencies-button {
          opacity: .5;
          cursor: not-allowed;
          pointer-events: none;
        }
        
        :host([view="waveform"]) #waveform-container,
        :host([view="waveform"]) #progress-container {
          display: block;
        }
        
        :host([view="waveform"]) #waveform-button {
          opacity: .5;
          cursor: not-allowed;
          pointer-events: none;
        }
        
        #progress-container {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          width: 0;
          border-right-width: 1px;
          border-right-style: solid;
          border-right-color: var(--waveform-progress-color);
        }
        
        audio {
          display: none;
        }
        
        #stop-capture-audio,
        #stop-record-audio {
          display: none;
        }
        
        #stop-record-audio {
          --font-color: #ff0000;
        }
        
        #record-audio {
          --font-color: #ff0000;
          opacity: .5;
          cursor: not-allowed;
          pointer-events: none;
        }
        
        #play {
          opacity: .5;
          cursor: not-allowed;
          pointer-events: none;
        }
        
        :host([src]) #play {
          opacity: 1;
          cursor: pointer;
          pointer-events: initial;
        }
        
        #pause {
          display: none;
        }
        
        :host([state="playing"]) #pause {
          display: block;
        }
        
        :host([state="playing"]) #play {
          display: none;
        }
        
        :host([state="capturing"]) #stop-capture-audio,
        :host([state="recording"]) #stop-capture-audio {
          display: block;
        }
        :host([state="capturing"]) #capture-audio,
        :host([state="recording"]) #capture-audio {
          display: none;
        }
        
        :host([state="capturing"]) #record-audio {
          opacity: 1;
          cursor: pointer;
          pointer-events: initial;
        }
        
        :host([state="recording"]) #stop-record-audio {
          display: block;
        }
        :host([state="recording"]) #record-audio {
          display: none;
        }
      </style>
      
      <audio id="input" controls></audio>
      
      <div id="container">
        <div id="audio-container">
          <div id="frequencies-container">
            <canvas id="frequencies"></canvas>
          </div>
  
          <div id="waveform-container">
            <canvas id="waveform"></canvas>
          </div>
          
          <div id="progress-container">
            <canvas id="progress"></canvas>
          </div>
        </div>
        
        <div id="controls">
          <div id="buttons">
            <material-button id="capture-audio" raised part="button">
              <i class="material-icons" slot="left-icon">mic</i>
            </material-button>
            
            <material-button id="stop-capture-audio" raised part="button">
              <i class="material-icons" slot="left-icon">mic_off</i>
            </material-button>
            
            <material-button id="play" raised part="button">
              <i class="material-icons" slot="left-icon">play_arrow</i>
            </material-button>
            
            <material-button id="pause" raised part="button">
              <i class="material-icons" slot="left-icon">pause</i>
            </material-button>
      
            <material-button id="record-audio" raised part="button">
              <i class="material-icons" slot="left-icon">fiber_manual_record</i>
            </material-button>
            
            <material-button id="stop-record-audio" raised part="button">
              <i class="material-icons" slot="left-icon">stop</i>
            </material-button>
            
            <material-button id="frequencies-button" raised part="button">
              <i class="material-icons" slot="left-icon">equalizer</i>
            </material-button>
            
            <material-button id="waveform-button" raised part="button">
              <i class="material-icons" slot="left-icon">graphic_eq</i>
            </material-button>
          </div>
          
          <div id="volume-container">
            <material-button id="volume-min" circle part="volume-button">
              <i class="material-icons" slot="left-icon">volume_off</i>
            </material-button>
            
            <material-slider id="volume" value="100" max="100" part="slider"></material-slider>
            
            <material-button id="volume-max" circle part="volume-button">
              <i class="material-icons" slot="left-icon">volume_up</i>
            </material-button>
          </div>
        
          <div id="time" part="time">
            <span id="elapsed-time"></span> / <span id="total-time"></span>
          </div>
        </div>
      </div>
    `;

    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.secs = 0;
    this.pauseTime = 0;
    this.audioBuffers = [];
    this.frequencies = false;
    this.state = 'idle';
    this.view = this.getAttribute('view') || 'frequencies';
    this.bars = parseInt(this.getAttribute('bars') || 20, 10);

    this.mediaElementSource = null;
    this.mediaStreamSource = null;

    this.maxChunkLength = 524000; //1024000 * 50;
    this.canvas = this.shadowRoot.querySelector('#waveform');
    this.canvasContext = this.canvas.getContext('2d');
    this.progressCanvas = this.shadowRoot.querySelector('#progress');
    this.progressCanvasContext = this.progressCanvas.getContext('2d');
    this.audioContainer = this.shadowRoot.querySelector('#audio-container');
    this.frequencyCanvas = this.shadowRoot.querySelector('#frequencies');
    this.frequencyCanvasContext = this.frequencyCanvas.getContext('2d');
    this.waveformContainer = this.shadowRoot.querySelector('#waveform-container');
    this.progressContainer = this.shadowRoot.querySelector('#progress-container');
    this.frequenciesContainer = this.shadowRoot.querySelector('#frequencies-container');

    this.playButton = this.shadowRoot.querySelector('#play');
    this.pauseButton = this.shadowRoot.querySelector('#pause');
    this.elapsedTime = this.shadowRoot.querySelector('#elapsed-time');
    this.totalTime = this.shadowRoot.querySelector('#total-time');
    this.volume = this.shadowRoot.querySelector('#volume');
    this.volumeMinButton = this.shadowRoot.querySelector('#volume-min');
    this.volumeMaxButton = this.shadowRoot.querySelector('#volume-max');
    this.input = this.shadowRoot.querySelector('audio');
    this.freqButton = this.shadowRoot.querySelector('#frequencies-button');
    this.waveformButton = this.shadowRoot.querySelector('#waveform-button');
    this.captureAudioButton = this.shadowRoot.querySelector('#capture-audio');
    this.stopCaptureAudioButton = this.shadowRoot.querySelector('#stop-capture-audio');
    this.recordAudioButton = this.shadowRoot.querySelector('#record-audio');
    this.stopRecordAudioButton = this.shadowRoot.querySelector('#stop-record-audio');
  }

  resizeCanvas({width, height}) {
    this.canvas.width = 0;
    this.canvas.height = 0;

    this.canvas.width = width;
    this.canvas.height = height;

    this.progressCanvas.width = width;
    this.progressCanvas.height = height;

    this.frequencyCanvas.width = width;
    this.frequencyCanvas.height = height;

    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
  }

  connectedCallback() {
    const hostStyle = getComputedStyle(this.shadowRoot.host);
    const waveformBackgroundColor = hostStyle.getPropertyValue('--waveform-background-color');
    const waveformColor = hostStyle.getPropertyValue('--waveform-color');
    const waveformProgressColor = hostStyle.getPropertyValue('--waveform-progress-color');

    this.canvases = [
      {
        element: this.canvas,
        context: this.canvasContext,
        fillStyle: waveformBackgroundColor,
        strokeStyle: waveformColor
      },
      {
        element: this.progressCanvas,
        context: this.progressCanvasContext,
        fillStyle: waveformBackgroundColor,
        strokeStyle: waveformProgressColor
      }
    ];

    this.frequenciesBackgroundColor = hostStyle.getPropertyValue('--frequency-background-color');
    this.frequenciesBarsColor = hostStyle.getPropertyValue('--frequency-bars-color');

    setTimeout(() => {
      const {width, height} = this.audioContainer.getBoundingClientRect();
      this.resizeCanvas({width, height});

      if('ResizeObserver' in window) {
        let observerStarted = true;

        const observer = new ResizeObserver(entries => {
          if(observerStarted) {
            observerStarted = false;
            return;
          }

          entries.forEach(({contentRect}) => {
            this.resizeCanvas(contentRect);

            if(this.view === 'waveform' && this.recording) {
              this.renderWaveform(this.recording);
            }
            if(this.view === 'frequencies' && this.analyser) {
              cancelAnimationFrame(this.frequencyAnimation);
              this.renderFrequencyAnalyzer();
            }

            observerStarted = true;
            observer.observe(this.audioContainer);
          });
        });

        observer.observe(this.audioContainer);
      }
    });

    this.showTotalTime(0);
    this.showElapsedTime(0);

    this.audioContainer.addEventListener('click', this.handleWaveformClick.bind(this));
    this.playButton.addEventListener('click', this.playPause.bind(this));
    this.pauseButton.addEventListener('click', this.playPause.bind(this));
    this.volume.addEventListener('change', e => this.setVolume(e.detail.value / 100));
    this.input.addEventListener('ended', this.stopAudio.bind(this));
    this.freqButton.addEventListener('click', this.showFrequencyAnalyzer.bind(this));
    this.waveformButton.addEventListener('click', this.showWaveform.bind(this));
    this.captureAudioButton.addEventListener('click', this.captureAudio.bind(this));
    this.stopCaptureAudioButton.addEventListener('click', this.stopCaptureAudio.bind(this));
    this.recordAudioButton.addEventListener('click', this.recordAudio.bind(this));
    this.stopRecordAudioButton.addEventListener('click', this.stopRecordAudio.bind(this));
    this.volumeMinButton.addEventListener('click', e => {
      this.setVolume(0);
      this.volume.value = 0;
    });

    this.volumeMaxButton.addEventListener('click', e => {
      this.setVolume(100);
      this.volume.value = 100;
    });

    const init = () => {
      this.context = new AudioContext();
      this.output = this.context.destination;
      this.gainNode = this.context.createGain();
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 256;

      document.removeEventListener('mousedown', init);
    };

    document.addEventListener('mousedown', init);
  }

  getMediaElementSource(input) {
    if(!this.mediaElementSource) {
      this.mediaElementSource = this.context.createMediaElementSource(input);

      this.mediaElementSource.connect(this.analyser);
      this.mediaElementSource.connect(this.gainNode);
    }

    return this.mediaElementSource;
  }

  getMediaStreamSource(input) {
    if(!this.mediaStreamSource) {
      this.mediaStreamSource = this.context.createMediaStreamSource(input);

      this.mediaStreamSource.connect(this.analyser);
      this.mediaStreamSource.connect(this.gainNode);
    }

    return this.mediaStreamSource;
  }

  async initializeAudio(input) {
    this.curSource = input instanceof HTMLAudioElement ? this.getMediaElementSource(input) : this.getMediaStreamSource(input);

    this.curSource.connect(this.analyser);
    this.curSource.connect(this.gainNode);
  }

  async openFile(file) {
    await this.loadFile(file);
    await this.initializeAudio(this.input);
  }

  async loadFile(file) {
    const reader = new FileReader();

    reader.onloadend = e => this.src = e.target.result;
    reader.readAsDataURL(file);

    await this.renderWaveform(file);
    await this.initializeAudio(this.input);

    this.view = 'waveform';
  }

  async captureAudio() {
    this.stream = await navigator.mediaDevices.getUserMedia({audio: true});

    await this.initializeAudio(this.stream);

    this.renderFrequencyAnalyzer();
    this.view = 'frequencies';
    this.state = 'capturing';
  }

  stopCaptureAudio() {
    if(this.stream) {
      this.stream.getTracks().map(track => track.stop());
      this.mediaStreamSource = null;
      this.state = 'idle';
    }
  }

  recordAudio() {
    const chunks = [];

    this.recorder = new MediaRecorder(this.stream);

    this.recorder.start(250);

    this.state = 'recording';

    const handleStopRecording = async () => {
      this.recording = new Blob(chunks, {type: 'audio/mpeg'});

      this.stopCaptureAudio();
      await this.loadFile(this.recording);
    };

    const processChunk = ({data}) => {
      if(data !== undefined && data.size !== 0) {
        chunks.push(data);

        const recording = new Blob(chunks, {type: 'audio/mpeg'});
        this.renderWaveform(recording);
      }
    };

    this.recorder.addEventListener('dataavailable', processChunk);
    this.recorder.addEventListener('stop', handleStopRecording);
  }

  stopRecordAudio() {
    this.recorder.stop();
  }

  showFrequencyAnalyzer() {
    this.view = 'frequencies';
  }

  showWaveform() {
    this.view = 'waveform';
  }

  setVolume(value) {
    this.gainNode.gain.setValueAtTime(value, this.context.currentTime);
  }

  handleWaveformClick(e) {
    if(this.curSource) {
      this.state = 'idle';
      this.input.pause();

      cancelAnimationFrame(this.timerId);
    }

    this.progressContainer.style.width = `${e.offsetX}px`;
    this.input.currentTime = (e.offsetX / this.canvasWidth) * this.duration;
    this.showElapsedTime(this.input.currentTime);
  }

  stringToArrayBuffer(byteString) {
    return new Uint8Array(byteString.length).map((_, i) => byteString.codePointAt(i));
  }

  getArrayBuffer(blob) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);

    return new Promise((resolve, reject) => {
      reader.onerror = err => reject(err);
      reader.onloadend = e => resolve(e.target.result);
    });
  }

  sliceAudio(buffer, start, end) {
    const chunk = start + end === buffer.byteLength ? buffer : buffer.slice(start, end);
    const blob = new Blob([new Uint8Array(this.header), new Uint8Array(chunk)]);
    const reader = new FileReader();

    reader.readAsArrayBuffer(blob);

    return new Promise((resolve, reject) => {
      reader.onloadend = e => {
        const buffer = e.target.result;

        this.context.decodeAudioData(buffer)
        .then(decodedBuffer => resolve(decodedBuffer))
        .catch((err) => reject(err));
      };
    });
  }

  async getAudioBuffers(buffer) {
    const bufferLength = buffer.byteLength;
    const chunkLength = bufferLength > this.maxChunkLength ? this.maxChunkLength : bufferLength;

    let start = 0;
    let end = start + chunkLength;
    const self = this;

    const slice = (buffer, start, end) => {
      async function* gen() {
        while(start < bufferLength) {
          const decodedBuffer = await self.sliceAudio(buffer, start, end);
          yield decodedBuffer;

          start += chunkLength;
          end = start + chunkLength > bufferLength ? bufferLength : start + chunkLength;
        }
      }

      return gen();
    };

    const audioBuffers = [];

    for await (const decodedBuffer of slice(buffer, start, end)) {
      audioBuffers.push(decodedBuffer);
    }

    return audioBuffers;
  }

  getNodesAfterOffset(nodes, offset) {
    let duration = 0;
    let skipped = 0;

    const remaining = nodes.filter(node => {
      duration += node.buffer.duration;
      skipped += duration < offset ? node.buffer.duration : 0;

      return duration > offset;
    });

    return [remaining, offset - skipped];
  }

  playPause() {
    this.renderFrequencyAnalyzer();

    const progress = () => {
      const diff = (this.input.currentTime);
      this.showElapsedTime(diff);
      const progressWidth = ((diff / this.duration) * this.canvasWidth);
      this.progressContainer.style.width = progressWidth + 'px';

      this.timerId = requestAnimationFrame(progress);
    };

    if(this.state === 'playing') {
      this.state = 'idle';

      this.input.pause();
      cancelAnimationFrame(this.timerId);
      this.pauseTime = (this.input.currentTime);
    }
    else {
      this.state = 'playing';

      this.input.play();
      requestAnimationFrame(progress);
    }
  }

  stopAudio() {
    this.state = 'idle';
    cancelAnimationFrame(this.timerId);

    this.input.currentTime = 0;
    this.progressContainer.style.width = 0;
    this.showElapsedTime(0);
  }

  formatTime(secs) {
    const minute = 60;
    const hour = 3600;

    const hrs = Math.floor(secs / hour);
    const min = Math.floor((secs % hour) / minute);
    const sec = Math.floor(secs) % minute;

    const hours = hrs < 10 ? `0${hrs}` : hrs;
    const minutes = min < 10 ? `0${min}` : min;
    const seconds = sec < 10 ? `0${sec}` : sec;
    return hours !== '00' ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  }

  showElapsedTime(secs) {
    this.elapsedTime.innerHTML = this.formatTime(secs);
  }

  showTotalTime(secs) {
    this.totalTime.innerHTML = this.formatTime(secs);
  }

  renderFrequencyAnalyzer() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    const barWidth = (this.canvasWidth - (this.bars - 1)) / this.bars;

    this.frequencyCanvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    const draw = () => {
      this.frequencyAnimation = requestAnimationFrame(draw);
      this.analyser.getFloatFrequencyData(dataArray);
      this.frequencyCanvasContext.fillStyle = this.frequenciesBackgroundColor;
      this.frequencyCanvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      let x = 0;

      dataArray.map((_, i) => {
        const barHeight = (dataArray[i] + 140) * 2;

        this.frequencyCanvasContext.fillStyle = this.frequenciesBarsColor;
        this.frequencyCanvasContext.fillRect(x, this.canvasHeight - barHeight * 0.75, barWidth, barHeight * 0.75);

        x += barWidth + 1;
      });
    };

    draw();
  }

  getWaveformData(buffers) {
    const dataArrays = buffers.map(buffer => buffer.getChannelData(0));
    const totalLength = dataArrays.reduce((total, data) => total + data.length, 0);
    const channelData = new Float32Array(totalLength);

    let offset = 0;

    dataArrays.forEach(data => {
      channelData.set(data, offset);
      offset += data.length;
    });

    return channelData;
  }

  async renderWaveform(file) {
    const buffer = await this.getArrayBuffer(file);
    const audioBuffers = await this.getAudioBuffers(buffer);

    this.header = buffer.slice(0, 44);
    this.audioBuffers = audioBuffers;
    this.duration = audioBuffers.reduce((total, buffer) => total + buffer.duration, 0);

    this.showTotalTime(this.duration);

    const channelData = this.getWaveformData(audioBuffers);
    const drawLines = 2000;
    const totallength = channelData.length;
    const eachBlock = Math.floor(totallength / drawLines);
    const lineGap = (this.canvasWidth / drawLines);

    this.canvases.forEach(canvas => {
      canvas.context.save();
      canvas.context.fillStyle = canvas.fillStyle;
      canvas.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      canvas.context.strokeStyle = canvas.strokeStyle;
      canvas.context.translate(0, this.canvasHeight / 2);
      canvas.context.lineWidth = 1;
      canvas.context.beginPath();

      for(let i = 0; i <= drawLines; i++) {
        const audioBuffKey = Math.floor(eachBlock * i);
        const x = i * lineGap;
        const y = channelData[audioBuffKey] * this.canvasHeight * 0.8;

        canvas.context.moveTo(x, y);
        canvas.context.lineTo(x, (y * -1));
      }

      canvas.context.stroke();
      canvas.context.restore();
      canvas.context.strokeStyle = canvas.strokeStyle;
      canvas.context.moveTo(0, this.canvasHeight / 2);
      canvas.context.lineTo(this.canvasWidth, this.canvasHeight / 2);
      canvas.context.stroke();
      canvas.context.restore();
    });
  }

  get view() {
    return this.getAttribute('view');
  }

  set view(value) {
    this.setAttribute('view', value);
  }

  get state() {
    return this.getAttribute('state');
  }

  set state(value) {
    this.setAttribute('state', value);
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(value) {
    this.setAttribute('src', value);
    this.input.src = value;
  }

  clearWaveform() {
    this.canvases.forEach(canvas => canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height));
  }

}

customElements.define('audio-recorder', AudioRecorder);
