//=================== HELPERS =========================
// just some basic utilities so I don't have to use jquery.

//helper function to do document.querySelector
function q(str){
    return document.querySelector(str);
}


//helper method to do el.innerHTML
function innerHTML(el, str){
    el.innerHTML = str;
}

function print(...thing){
    console.log(...thing);
}

function removeClass(el, ...names){
    el.classList.remove(...names);
}

function addClass(el,...names){
    el.classList.add(...names);
}
//helper function to do document.createElement("tag")
//returns whatever document.createElement returns
function create(tag, ...classNames){
    var el = document.createElement(tag);
    addClass(el, ...classNames)
    return el;
}


function div( ...cnames){
    // print("div")
    return create("div",...cnames)
}
//helper function to do parent.appendChild(child)

function addChild(parent, ...children){
    children.forEach(child => {
        parent.appendChild(child);
    })
}




//=================== /HELPERS =========================

