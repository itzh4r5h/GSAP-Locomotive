let animationProperties = {
    scale: 0,
    rotate: -720,
    duration: 1.5,
}


gsap.from("#page1 .square",{
   ...animationProperties,
    delay: 1
})


// gsap.from("#page2 .square",{
//     ...animationProperties,
//    scrollTrigger: {
//     trigger: "#page2 .square",
//     scroller: "body",
//     markers: true,
//     start: "top 75%",
//     end: "top 20%",
//     scrub: 2,
//    }
// })


gsap.from("#page2 .square",{
    ...animationProperties,
   scrollTrigger: {
    trigger: "#page2",
    scroller: "body",
    markers: true,
    start: "top 0",
    end: "top -100%",
    scrub: 2,
    pin: true
   }
})


