let gsapTimeLine = gsap.timeline()

gsapTimeLine.from(["main nav h2","main nav ul li"],{
    y: -50,
    opacity: 0,
    duration: 0.6,
    stagger: .4,
    delay: .3,
})


gsapTimeLine.from("main header h1",{
    x: -500,
    opacity: 0,
    duration: .6,
    stagger: .4
})


gsapTimeLine.from("main header img",{
    x: 200,
    rotate: 100,
    opacity: 0,
    duration: .6,
    stagger: .5
})
