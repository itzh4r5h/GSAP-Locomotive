let txtData = [
    "Set within the",
    "verdant pine and",
    "oak tree forest of",
    "Mljet National Park,",
    "Hotel Odisej Mljet is",
    "just two hours by",
    "passenger or car",
    "ferry from",
    "Dubrovnik."
]

let page2 = document.querySelector("#page2")

function textSplit(data) {
    let finalData = []
    data.forEach(function (txtData) {
        let clutter = ''
        let splittedTextArray = txtData.split("")
        splittedTextArray.forEach(function (character) {
            clutter += `<span class="text-[#434B34]">${character}</span>`
        })
        finalData.push(clutter)
    })

    return finalData
}


function insertText(data) {
    let finalData = textSplit(data)
    finalData.forEach(function (element) {
        page2.innerHTML += `<h1 class="text-7xl text-center font-bold">${element}</h1>`
    })
}


function gsapAnimation() {
    gsap.to("#page2 h1 span", {
        color: "#E3E3C4",
        stagger: .2,
        scrollTrigger: {
            trigger: "#page2",
            scroller: "#main",
            scrub: 2,
            start: "top 0",
            end: "top -100%",
            pin: true,
        }
    })
}

function locomotiveSmoothScroll() {
    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true
    });
    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        }, // we don't have to define a scrollLeft because we're only scrolling vertically.
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
        pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
    });




    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();
}


locomotiveSmoothScroll()
insertText(txtData)
gsapAnimation()