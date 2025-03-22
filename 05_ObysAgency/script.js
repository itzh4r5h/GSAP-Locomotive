window.onbeforeunload = function(){
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function locomotiveSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger);

  // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("main"),
    smooth: true,
  });
  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update);

  // tell ScrollTrigger to use these proxy methods for the "main" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("main").style.transform
      ? "transform"
      : "fixed",
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();
}

function preLoading() {
  function startLoading() {
    let loading = document.querySelector("#loading");

    let increase = 0;

    let interval = setInterval(() => {
      if (increase < 100) {
        loading.textContent = increase;
        increase++;
      } else {
        loading.textContent = 100;
        clearInterval(interval);
      }
    }, 25);
  }

  let gsapTimeline = gsap.timeline();

  gsapTimeline.to("body", {
    overflow: "hidden",
  });
  gsapTimeline.from("#loader .line h1", {
    y: 150,
    stagger: 0.2,
    duration: 0.7,
    onStart: startLoading,
  });
  gsapTimeline.from(
    "#loader .line h4",
    {
      opacity: 0,
      duration: 1,
    },
    "<"
  );
  gsapTimeline.to(".line h1 #blink", {
    animationName: "blink",
    opacity: 1,
  });
  gsapTimeline.from("#loader p", {
    opacity: 0,
    duration: 0.5,
  });
  gsapTimeline.to(["#loader div", "#loader p"], {
    opacity: 0,
    stagger: 0.1,
    duration: 0.7,
    delay: 1.5,
  });
  gsapTimeline.to("#loader", {
    delay: 0.5,
    y: -1000,
    display: "none",
    onStart: function () {
      gsap.from("#headerPage .mainHeading .heading .line h1", {
        delay: 0,
        y: 150,
        stagger: 0.2,
        duration: 0.6,
      });
    },
  });

  gsapTimeline.to("body", {
    overflow: "visible",
  });
}

function cursor() {
  window.addEventListener("mousemove", function (details) {
    gsap.to("#cursor", {
      left: details.clientX,
      top: details.clientY,
      ease: "power4.out",
    });
  });
}

function magnetAnimation(elements) {
  function move(elem, boundingRect) {
    // Add an event listener for mouse movement over the target element
    elem.addEventListener("mousemove", (e) => {
      // Calculate mouse position relative to the target element
      const mousePosX = e.x - boundingRect.left; // X position
      const mousePosY = e.y - boundingRect.top; // Y position

      // Use GSAP (GreenSock Animation Platform) to animate the target element
      // This creates a 'magnetic' effect where the target element moves towards the mouse
      gsap.to(elem, {
        x: (mousePosX - boundingRect.width / 2) * 0.8, // Move horizontally towards mouse
        y: (mousePosY - boundingRect.height / 2) * 0.8, // Move vertically towards mouse
        duration: 0.8, // Duration of the animation
        ease: "power4.out", // Easing function for smooth animation
      });
    });
  }

  function leave(elem) {
    // Add an event listener for when the mouse leaves the target element area
    elem.addEventListener("mouseleave", () => {
      // Animate the target element back to its original position
      gsap.to(elem, {
        x: 0, // Reset horizontal position
        y: 0, // Reset vertical position
        duration: 0.8, // Duration of the animation
        ease: "power4.out", // Easing function for a smooth return
      });
    });
  }

  elements.forEach((element) => {
    // Select the target element or elements from the document
    let targetElements = document.querySelectorAll(element);

    Array.from(targetElements).forEach((domItem) => {
      // Get the taget's bounding rectangle dimensions and position
      let boundingRect = domItem.getBoundingClientRect();

      // Add an event listener to the window to update the bounding rectangle dimensions
      // when the window is resized
      window.addEventListener("resize", () => {
        boundingRect = domItem.getBoundingClientRect();
      });

      move(domItem, boundingRect);
      leave(domItem);
    });
  });
}

function scrollHintAnimation() {
  gsap.from("#scrollHint p", {
    keyframes: {
      "0%": { y: -40 },
      "50%": { y: 0, ease: "sine.out" },
      "100%": { y: 40, ease: "sine.in" },
    },
    duration: 2,
    repeat: -1,
  });

  gsap.to("#scrollHint p", {
    display: "none",
    ease: "sine.out",
    scrollTrigger: {
        trigger: "#scrollHint p",
        scroller: "main",
        start: "top 65%",
    }
  })

}

function flagHoverAnimation() {
  let webGrahpic = document.querySelector("#webGrahpic");
  
  webGrahpic.addEventListener("mousemove", function (details) {
    gsap.to("#flag", {
      top: details.offsetY,
      left: details.offsetX,
      opacity: 1,
      ease: "power4.out",
    });
  });

  webGrahpic.addEventListener("mouseleave", function () {
    gsap.to("#flag", {
      opacity: 0,
      duration: 0.9,
      ease: "power4.out",
    });
  });
}

function videoCursorAnimation() {
  let video = document.querySelector("video");
  let videoCursorPlayground = document.querySelector("#videoCursorPlayground");
  let button__playIcon = document.querySelector(".button__play-icon");
  let button__pauseIcon = document.querySelector(".button__pause-icon");
  let videoTumbnail = document.querySelector("#videoTumbnail");
  let videoPlay = 0;

  videoCursorPlayground.addEventListener("mousemove", function (info) {
    let offsetY = 0;
    gsap.to("#cursor",{
      opacity:0,
      ease: "power4.out"
    })

    if (info.offsetY > 363) {
      offsetY = info.offsetY - 363;
    }
    gsap.to("#videoButton", {
      top: info.offsetY - offsetY,
      left: info.offsetX,
      duration: 0.7,
      ease: "power4.out",
    });
  });

  videoCursorPlayground.addEventListener("click", function () {
    if (videoPlay === 0) {
      videoPlay = 1;
      gsap.to("#videoButton", {
        scale: 0.5,
        ease: "power4.out",
      });
      videoTumbnail.style.display = "none";
      video.style.visibility = "visible"
      video.play();
      button__playIcon.style.display = "none";
      button__pauseIcon.style.display = "block";
    } else {
      videoPlay = 0;
      gsap.to("#videoButton", {
        scale: 1,
        ease: "power4.out",
      });
      video.pause();
      video.style.visibility = "hidden"
      videoTumbnail.style.display = "block";
      button__playIcon.style.display = "block";
      button__pauseIcon.style.display = "none";
    }
  });

  videoCursorPlayground.addEventListener("mouseleave", function () {
    gsap.to("#cursor",{
      opacity:1,
      ease: "power4.out"
    })
    gsap.to("#videoButton", {
      top: 0,
      left: "75%",
      duration: 1,
      ease: "power4.out",
    });
  });
}

function textUpFromDownAnimationOnScroll(){
  let textUpFromDownList = document.querySelectorAll(".textUpFromDown")
  let projectNameList = document.querySelectorAll(".projectName .textUpFromDown")

 function animate(element,y,gsapFromOrTo){
  Array.from(element).forEach((textUpFromDown)=>{
    gsapFromOrTo(textUpFromDown, {
      y: y,
      stagger: .2,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
          trigger: textUpFromDown,
          scroller: "main",
          start: "top 100%",
      },
    })
  })
 }

 animate(textUpFromDownList,120,gsap.from)
 animate(projectNameList,1,gsap.to)

}

function thinLineGrowAnimationOnScroll(){
  let thinLines = document.querySelectorAll(".thinLine")

  Array.from(thinLines).forEach((thinLine)=>{
    gsap.to(thinLine, {
      animationName: "thinLineGrow",
      ease: "sine.out",
      scrollTrigger: {
          trigger: thinLine,
          scroller: "main",
          start: "top 100%",
      }
    })
  })
}

function textTranslateY(element){
  let elementList = document.querySelectorAll(element)

  Array.from(elementList).forEach((elName)=>{
    elName.addEventListener("mouseenter",function(info){
      gsap.to(info.target.children[0],{
        translateY: "-110%",
        ease: "power1.out"
      })
    })

    elName.addEventListener("mouseleave",function(info){
      gsap.to(info.target.children[0],{
        translateY: "0",
        ease: "power1.out"
      })
    })

  })  
}

function obsyCircleAnimation(){
  let obysCircles = document.querySelectorAll(".obysCircle")
  let gspaTl = gsap.timeline()

  Array.from(obysCircles).forEach((obysCircle)=>{
    obysCircle.addEventListener("mouseenter",function(info){
      gspaTl.to(info.target.children[1],{
        scale: 1,
        ease: "power2.out",
        onEnd: function(){
          gsap.to(info.target.children[1].children[0],{
            delay: .3,
            scale: 1,
            ease: "power4.out",
          })
        }
      })
    })

    obysCircle.addEventListener("mouseleave",function(info){
      gspaTl.to(info.target.children[1].children[0],{
        scale: 0,
        ease: "power4.out",
        onEnd: function(){
          gsap.to(info.target.children[1],{
            scale: 0,
            ease: "power3.out",
          })
        }
      })
    })

  })
}

function imgDistortionHoverAnimation() {
  Shery.imageEffect(".obysProject figure", {
    style: 2,
    gooey: true,
    config: {
      resolutionXY: { value: 100 },
      distortion: { value: true },
      mode: { value: -10 },
      mousemove: { value: 2 },
      modeA: { value: 1 },
      modeN: { value: 3 },
      speed: { value: 1, range: [-500, 500], rangep: [-10, 10] },
      frequency: { value: 50, range: [-800, 800], rangep: [-50, 50] },
      angle: { value: 0.5, range: [0, 3.141592653589793] },
      waveFactor: { value: 1, range: [-3, 3] },
      color: { value: 16733268 },
      pixelStrength: { value: 3, range: [-20, 100], rangep: [-20, 20] },
      quality: { value: 5, range: [0, 10] },
      contrast: { value: 1, range: [-25, 25] },
      brightness: { value: 1, range: [-1, 25] },
      colorExposer: { value: 0.18, range: [-5, 5] },
      strength: { value: 0.2, range: [-40, 40], rangep: [-5, 5] },
      exposer: { value: 8, range: [-100, 100] },
      zindex: { value: 9996999, range: [-9999999, 9999999] },
      aspect: { value: 0.7916666666666666 },
      ignoreShapeAspect: { value: true },
      shapePosition: { value: { x: 0, y: 0 } },
      shapeScale: { value: { x: 0.5, y: 0.5 } },
      shapeEdgeSoftness: { value: 0, range: [0, 0.5] },
      shapeRadius: { value: 0, range: [0, 2] },
      currentScroll: { value: 0 },
      scrollLerp: { value: 0.07 },
      gooey: { value: true },
      infiniteGooey: { value: false },
      growSize: { value: 4, range: [1, 15] },
      durationOut: { value: 1, range: [0.1, 5] },
      durationIn: { value: 1.5, range: [0.1, 5] },
      displaceAmount: { value: 0.5 },
      masker: { value: true },
      maskVal: { value: 1.4, range: [1, 5] },
      scrollType: { value: 0 },
      geoVertex: { range: [1, 64], value: 1 },
      noEffectGooey: { value: true },
      onMouse: { value: 1 },
      noise_speed: { value: 0.99, range: [0, 10] },
      metaball: { value: 0.4, range: [0, 1] },
      discard_threshold: { value: 0.5, range: [0, 1] },
      antialias_threshold: { value: 0, range: [0, 0.1] },
      noise_height: { value: 0.5, range: [0, 2] },
      noise_scale: { value: 8, range: [0, 100] },
    },
  });
}

function createText(){
  let h1 = document.querySelector("#letsCreate h1")

  let spanPlain = document.createElement("span")
  let spanSilk = document.createElement("span")
  

  function addClass(element,className){
    element.classList.add(className)
  }

  addClass(spanPlain,"spanPlain")
  addClass(spanSilk,"spanSilk")
  

  function makeWord(element){
    textArray = "Let’s create".split("")
    textArray.forEach((char)=>{
      let span = document.createElement("span")
      span.textContent = char
      element.appendChild(span)
    })
  }

  makeWord(spanPlain)
  makeWord(spanSilk)

  h1.appendChild(spanPlain)
  h1.appendChild(spanSilk)
}

function textAnimation(){
  let letsCreate = document.querySelector("#letsCreate")
  
  function animationStart(element_1, element_2, ml){
    let gsapTl = gsap.timeline()
    gsapTl.to(element_1,{
      opacity: 1,
      stagger: .035,
      ease: "power2.out",
      onStart: function(){
        gsap.to(element_2,{
          stagger: .035,
          opacity: 0,
          ease: "power2.out",
        })
      }
    },"<")
    
    gsap.to("#letsCreate svg",{
      delay: .4,
      marginLeft: ml,
      ease: "power2.out"
    })
  }

  letsCreate.addEventListener("mouseenter",function(){

    animationStart(
      "#letsCreate h1 .spanSilk span",
      "#letsCreate h1 .spanPlain span",
      "6rem"
    )

  })

  letsCreate.addEventListener("mouseleave",function(){

    animationStart(
      "#letsCreate h1 .spanPlain span",
      "#letsCreate h1 .spanSilk span",
      "2.5rem"
    )

  })

}

locomotiveSmoothScroll()
preLoading()
cursor()
magnetAnimation(["header nav .navRight .linkBox","nav .menu"])
scrollHintAnimation()
flagHoverAnimation();
videoCursorAnimation()
textUpFromDownAnimationOnScroll()
thinLineGrowAnimationOnScroll()
textTranslateY(".projectName")
obsyCircleAnimation()
imgDistortionHoverAnimation()
createText()
textAnimation()
textTranslateY(".socialLinkName")
textTranslateY(".info")


