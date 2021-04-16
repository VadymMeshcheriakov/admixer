interface PlayerType {
  showPlayerWithControls: () => Promise<void>;
  closePlayerWithControls: () => void;
  play: () => void;
  pause: () => void;
}

class Player implements PlayerType {
  video: HTMLVideoElement;
  videoContainer: HTMLElement;
  buttonWrapper: HTMLElement;

  loadButton: HTMLElement;
  playButton: HTMLElement;
  pauseButton: HTMLElement;
  closeButton: HTMLElement;

  loadButtonHandler: () => void;
  playButtonHandler: () => void;
  pauseButtonHandler: () => void;
  closeButtonHandler: () => void;

  url: string;

  constructor(videoContainer: HTMLElement, url: string) {
    this.url = url;
    this.videoContainer = videoContainer;

    this.video = document.createElement('video');
    this.buttonWrapper = document.createElement('div');

    this.loadButton = document.createElement('button');
    this.playButton = document.createElement('button');
    this.pauseButton = document.createElement('button');
    this.closeButton = document.createElement('button');

    this.loadButton.textContent = 'start';
    this.playButton.textContent = 'play';
    this.pauseButton.textContent = 'pause';
    this.closeButton.textContent = 'close';

    this.loadButtonHandler = this.showPlayerWithControls.bind(this);
    this.playButtonHandler = this.play.bind(this);
    this.pauseButtonHandler = this.pause.bind(this);
    this.closeButtonHandler = this.closePlayerWithControls.bind(this);

    this.init();
  }

  init() {
    this.videoContainer.append(this.buttonWrapper);

    this.loadButton.addEventListener('click', this.loadButtonHandler);
    this.buttonWrapper.append(this.loadButton);
  }

  async setVastUrl(url: string) {
    const response = await fetch(url);
    return await response.text();
  }

  async loadVideo() {
    const res = await this.setVastUrl(this.url);
    const parser = new DOMParser();
    const xml = parser.parseFromString(res, 'text/xml');
    const xmlElements = xml.querySelector('[type="video/mp4"]');

    return xmlElements as HTMLVideoElement;
  }

  async showPlayerWithControls() {
    const xmlVideoElement = await this.loadVideo();
    const width = parseInt(xmlVideoElement.getAttribute('width') as string, 10);

    this.video.src = xmlVideoElement.textContent as string;
    this.video.width = width;
    this.video.controls = false;

    this.showControls();
    this.videoContainer.append(this.video);
  }

  closePlayerWithControls() {
    this.removeControls();
    this.removePlayer();
  }

  showControls() {
    this.playButton.addEventListener('click', this.playButtonHandler);
    this.pauseButton.addEventListener('click', this.pauseButtonHandler);
    this.closeButton.addEventListener('click', this.closeButtonHandler);

    this.buttonWrapper.append(
      this.playButton,
      this.pauseButton,
      this.closeButton
    );
  }

  removeControls() {
    this.playButton.removeEventListener('click', this.playButtonHandler);
    this.pauseButton.removeEventListener('click', this.pauseButtonHandler);
    this.closeButton.removeEventListener('click', this.closeButtonHandler);

    this.playButton.remove();
    this.pauseButton.remove();
    this.closeButton.remove();
  }

  removePlayer() {
    this.video.remove();
  }

  play() {
    this.video.play();
  }

  pause() {
    this.video.pause();
  }
}

const url = 'https://inv-nets.admixer.net/dsp.aspx?rct=3&item=152bea5c-5635-4455-8cae-327b429cf376&pre=1';
const videoContainer = document.getElementById('root');

if (videoContainer) {
  new Player(videoContainer, url);
}
