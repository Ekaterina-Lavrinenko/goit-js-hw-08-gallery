import imagesRefs from './gallery-items.js';

class Gallery {
  constructor(imagesArrayRefs, parentSelector) {
    this.images = imagesArrayRefs;
    this.galleryRef = document.querySelector(parentSelector);
    this.lightBoxRef = document.querySelector('.js-lightbox');
    this.lightBoxImgRef = document.querySelector('.lightbox__content .lightbox__image');
    this.closeLigthBoxBtn = document.querySelector('[data-action="close-lightbox"]');
    this.overlayRef = document.querySelector('.lightbox__overlay');

    this.onCloseLigthBoxBtnClick = this.onCloseLigthBoxBtnClick.bind(this);

    this.startRenderGallery = this.setMarkup; 
  }

  setMarkup() {
    const markup = this.images
      .map(
        ({ preview, original, description }) =>
          `<li class="gallery__item">
      <a class="gallery__link" href="${original}">
        <img
          class="gallery__image"
          data-preview="${preview}"
          data-source="${original}"
          alt="${description}"
        />
      </a>
    </li>`,
      )
      .join('');
    this.addMarkup(markup);
  }
    
  addMarkup(markup) {
    this.galleryRef.insertAdjacentHTML('afterbegin', markup);
    this.galleryRef.addEventListener('click', e => {
      this.onImageClick.call(this, e);
    });

    this.preloaderImg();
  }

  preloaderImg() {
    const options = {
      threshold: 0.7,
      root: document,
      delay: 500,
      trackVisibility: true,
    };

    const galleryImageRef = document.querySelectorAll('.gallery__image');

    const callback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.src = entry.target.dataset.preview;
          observer.unobserve(entry.target);
        }
      });
    };
    const observer = new IntersectionObserver(callback, options);

    galleryImageRef.forEach(imageRef => {
      observer.observe(imageRef);
    });
  }

  onImageClick(event) {
    event.preventDefault();
    const isDataSource = event.target.dataset.source;
    if (!isDataSource) {
      return;
    }

    this.lightBoxRef.classList.add('is-open');
    this.addEventListeners();
    const ligthboxImageSrc = event.target.dataset.source;
    const ligthboxImageAlt = event.target.alt;
    this.addImageLigthbox(ligthboxImageSrc, ligthboxImageAlt);
  }

  addImageLigthbox(src, alt) {
    this.lightBoxImgRef.src = src;
    this.lightBoxImgRef.alt = alt;
  }
    
  onCloseLigthBoxBtnClick() {
    this.lightBoxRef.classList.remove('is-open');
    this.addImageLigthbox('', '');
    this.deleteEventListeners();
  }

  addEventListeners() {
    this.overlayRef.addEventListener('click', this.onCloseLigthBoxBtnClick);
    this.closeLigthBoxBtn.addEventListener('click', this.onCloseLigthBoxBtnClick);
  }

  deleteEventListeners() {
    this.overlayRef.removeEventListener('click', this.onCloseLigthBoxBtnClick);
    this.closeLigthBoxBtn.removeEventListener('click', this.onCloseLigthBoxBtnClick);
  }
}


const gallery = new Gallery(imagesRefs, '.js-gallery');
gallery.startRenderGallery();

