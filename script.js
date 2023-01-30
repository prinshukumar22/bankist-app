'use strict';
const header = document.querySelector('header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const scrollbtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1')
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const contents = document.querySelectorAll('.operations__content');
const nav = document.querySelector('nav')
const siblings = document.querySelectorAll('.nav__link')
// console.log(siblings)
const img = nav.querySelector('img');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click',openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Scroll Window

scrollbtn.addEventListener('click',function (e) { 
  let s1coord = section1.getBoundingClientRect();
  console.log(s1coord);

  // console.log(e.target.getBoundingClientRect());
  console.log('Current scroll (X/Y)', window.pageXOffset,window.pageYOffset)

  //scroll
  window.scrollTo(s1coord.x+window.pageXOffset,s1coord.y+window.pageYOffset);
})

//Page navigation
//SLOWER
// document.querySelectorAll('.nav__link').forEach(nav =>{
//   nav.addEventListener('click',e=>{
//     e.preventDefault();
//     const id = nav.getAttribute('href');
//     // console.log(id)
//     document.querySelector(id).scrollIntoView({behavior:"smooth",})
//     // console.log('link');
//   })
// })

//FASTER
document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();

  //Matching strategy
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    // console.log(id)
    document.querySelector(id).scrollIntoView({behavior:"smooth",})
  }
})

//Tabbed component

tabContainer.addEventListener('click',function(e){
  const clicked = e.target.closest('.operations__tab')
  // console.log(clicked);

  //Matching strategy
  //guard clause
  if(!clicked) return

  if(clicked){
    // console.log('clicked');
    //remove active classes
    tabs.forEach(a => a.classList.remove('operations__tab--active'))
    contents.forEach(c => c.classList.remove('operations__content--active'))
    //activate tab
    clicked.classList.add('operations__tab--active')

    //activate content
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
  }
})

//menu fade animation

const handleOver = function (ev){
  if(ev.target.classList.contains('nav__link')){
    console.log('Hovered');
    const link = ev.target
    siblings.forEach(c =>{
      if(ev.type==='mouseover'){
        if(link !== c) c.style.opacity = this
        img.style.opacity = this
      }
      if(ev.type==='mouseout'){
        c.style.opacity = this
        img.style.opacity = this
      }
    })
  }
}

nav.addEventListener('mouseover',handleOver.bind(0.5));

//bind function create a copy of the function in which it is called and set this keyword to the argument passed in bind

nav.addEventListener('mouseout',handleOver.bind(1));

//Sticky navigation:

// NORMAL WAY
// const sec1Cord = section1.getBoundingClientRect()
// window.addEventListener('scroll',function(e){
//   // console.log(window.scrollY);
//   if(window.scrollY > sec1Cord.top){
//     nav.classList.add('sticky');
//   }
//   else{
//     nav.classList.remove('sticky');
//   }
// })

// USING Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;

const obsOpt = {
  root: null,
  threshold:0,
  rootMargin:`-${navHeight}px`,//add a box to the target element of the given amount if it's negative then minus that much part.
}

const obsCallback = (entries) => {
  // console.log(entries)
  const [entry] = entries;
  entry.isIntersecting === false ? nav.classList.add('sticky'):nav.classList.remove('sticky')
  // nav.classList.toggle('sticky');
}
const observer = new IntersectionObserver(obsCallback,obsOpt);
observer.observe(header);

//Reveal Sections
const sections = document.querySelectorAll('.section');
const revealSection = function(entries,observer){
  const [entry] = entries
  // console.log(entry);

  //guard clause
  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  //use to unobserve
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection,{
  root:null,
  threshold:0.15,
})

sections.forEach(section => {
  sectionObserver.observe(section);
})

//LAZY LOADING IMAGES
const lazyImgs = document.querySelectorAll('img[data-src]');

const lazyLoad = function(entries,observer){
  const [entry] = entries;
  // console.log(entry);
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;//loading
  entry.target.addEventListener('load',function(){
    //jab load hojaega tab execute hoga
    entry.target.classList.remove('lazy-img')
  })
  observer.unobserve(entry.target)
}

const imgObserver = new IntersectionObserver(lazyLoad,{
  root:null,
  thershold:0,
  rootMargin:'200px',//so that user can't see lazy loading
})

lazyImgs.forEach(lazyimg => imgObserver.observe(lazyimg));

//Slider
const slider = function() {
  const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnRight = document.querySelector('.slider__btn--right')
const btnLeft = document.querySelector('.slider__btn--left')
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');
const makeSlide = (curSlide) => {
  slides.forEach((e,i) =>{
    e.style.transform = `translateX(${100*(i-curSlide)}%)`;
  })   
  // document.querySelector(`button[dataset-slide=${curSlide+''}]`).classList.add('dots__dot--active');
}
slides.forEach((_,i) => {
  dotContainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${i}"></button>`)
})
const activateDot = slide =>{
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'))
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
}
let currSlide = 0;
// slider.style.transform = 'scale(0.4) translateX(-800px)'
// slider.style.overflow = 'visible'

//0% 100% 200% 300% (coz width of image is 100%)

const nextSlide = function(e){
  if(currSlide === maxSlide-1) currSlide = 0;
  else currSlide++
  makeSlide(currSlide);
  activateDot(currSlide);
}
const prevSlide = function(){
  if(currSlide === 0 )  currSlide = maxSlide-1;
  else currSlide--;
  makeSlide(currSlide);
  activateDot(currSlide);
}
const init = ()=>{
  makeSlide(0);
  activateDot(0);
}
init()
//Event handlers
btnRight.addEventListener('click',nextSlide)
btnLeft.addEventListener('click',prevSlide)
document.addEventListener('keydown',function(e){
  console.log(e);
  e.key === 'ArrowLeft' && prevSlide()
  e.key === 'ArrowRight' && nextSlide()
})
dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    console.log('dot');
    const slide = e.target.dataset.slide;
    makeSlide(slide);
    activateDot(slide);
  }
})

}
function addfeature(){
  console.log('added new branch');
}

slider();
// console.log('Hi');

//Intersection observer API
// const obsOpt = {
//   root:null,//viewport
//   threshold:0.2,//[0,0.2]
// }

// const obsCallback = (entries,observer) =>{
// //entries = array of threshold, observer = obs
// entries.forEach(entry => console.log(entry));
// }
// //obsCallback will be called when the target element touch the threshold of 20%

// const obs = new IntersectionObserver(obsCallback,obsOpt);
// obs.observe(section1);

//Bubbling of events
// const randomNo = (max,min) => Math.floor(Math.random()*(max-min)+1 + min);

// const randomColor = () => `rgb(${randomNo(255,0)},${randomNo(255,0)},${randomNo(255,0)})`;


// document.querySelector('.nav').addEventListener('click', function(e) {
//   console.log('link')
//   this.style.backgroundColor = randomColor()
//   //e.currentTarget = this = where event handler is attached
// });
// document.querySelector('.nav__links').addEventListener('click', function(e) {
//   console.log('link')
//   this.style.backgroundColor = randomColor()

// });
// document.querySelector('.nav__link').addEventListener('click', function(e) {
//   console.log('link')
//   this.style.backgroundColor = randomColor()
//   // e.stopPropagation()


