/****************************/
/*GRID EDITING FUNCIONS
/****************************/

//Sets the current color in the pallette
function setColor(){
    color = getComputedStyle(this).backgroundColor;
    
    colorButtons.forEach(function(thisObj){
        if(thisObj.textContent!=color){
            thisObj.style.border="2px solid black";
            
        }
    })

    gridDiv.forEach(function(thisObj){
        thisObj.classList.remove('marked');
    })

    this.style.border = "2px solid white";
}

function shadeOnOFf(){
    if(shading==true){
        shading=false;
        shadingToggle.textContent = "Shading OFF";
    }
    else{
        shading= true;
        shadingToggle.textContent = "Shading ON";
    }
}

//Adds selected background color. Adds event listener to continue coloring on blocks that are hovered over
function startColor(){
    //Allows colors to be shaded more over repeated areas if shading is enabled and color is not white
    if(this.classList[1]=='marked' && shading==true && color != 'rgb(255, 255, 255)'){
        let previousRgb = this.style.backgroundColor.match(/\d*/g);
        //Numerical characters are extracted at index 4,7,and 10 respectively
        this.style.backgroundColor = "rgb("+(previousRgb[4]*0.8)+", "+(previousRgb[7]*0.8)+", "+(previousRgb[10]*0.8)+")";
    }

    else{
        this.style.backgroundColor = color;
    }

    this.classList.add("marked");
    gridDiv.forEach(function(thisObj){ 
        thisObj.addEventListener('mouseover',startColor);
    })
}

function stopColor(){
    if(gridDiv.length>0){
    gridDiv.forEach(function(thisObj){
        thisObj.removeEventListener('mouseover',startColor);
    })
    }
}


//Allows blocks to be erased depending on slider position similiar to an actual etch a sketch
function slideErase(){
    let sliderValue = parseInt(slider.value);
    let i=1;
    gridDiv.forEach(function(thisObj){
        if(i==sliderValue){
            thisObj.style.backgroundColor = "rgb(255, 255, 255";
            thisObj.classList.remove('marked');
            sliderValue+=gridResolution;
            }
        i++  
        }    
    ) 
}

//Allows grid and blocks to be resized when window is changed
function resizeGrid(){
    setColumnsRows();
    setGridBlockProperties()
    setSliderParameters();
}

//Clears canvas and creates new grid. 
function NewCanvas(){
    //Stoes orginal grid in case user enters invalid value
    let newGridResolution=parseInt(document.querySelector('.grid-dim').value);
    if(isNaN(newGridResolution)||newGridResolution>99 || newGridResolution<1){
        alert("Invalid value. Please input a number between 1 and 99");
    }
    else{
        gridResolution = newGridResolution;
        //Updates the text box to match the height input
        document.querySelector('.disabled').placeholder = gridResolution;
        clearBlocks()
        createBlocks();
        setColumnsRows()
        setGridBlockProperties();
        setGridBlockEvents();
        setSliderParameters()
    }
}

/****************************/
/*GRID BUILDING FUNCIONS
/****************************/

//Removes previous blocks from container
function clearBlocks(){
    while(drawingContainer.firstChild){ 
        drawingContainer.removeChild(drawingContainer.firstChild);
    }
}

//Adds new blocks to container
function createBlocks(){
    for(let i=0;i<(gridResolution*gridResolution);i++){ 
            drawingContainer.appendChild(document.createElement('div'));
        }
    
    //store generated blocks in a nodelist;
    gridDiv = drawingContainer.childNodes; 
}

//Calculates and sets the grid column and rows length based on container size for new canvas or window resizing
function setColumnsRows(){
    drawingContainerWidth=getComputedStyle(drawingContainer).width.match(/\d*/);
    columnWidth = drawingContainerWidth[0]/gridResolution;
    let cssText = "";

    //Creates string for CSS property
    for(let i=0;i<gridResolution;i++){ 
        cssText += columnWidth+"px ";
    }

    drawingContainer.style.gridTemplateColumns = cssText;
    drawingContainer.style.gridTemplateRows = cssText;
}

//Adds specified CSS properties for grid blocks
function setGridBlockProperties(){
    gridDiv.forEach(function(thisObj){
        thisObj.classList.add('grid-block');
        }
    )
}

function setGridBlockEvents(){
    //gridDiv = Array.from(drawingContainer.children);
    gridDiv.forEach(function(thisObj){
        thisObj.addEventListener('mousedown',startColor);
        }
    )
}

/****************************/
/*SLIDER BUILDING FUNCIONS
/****************************/
function setSliderParameters(){
    slider.max=gridResolution+1;
    slider.style.width=columnWidth*(gridResolution)+"px" 
}

//SELECTORS
const drawingContainer = document.querySelector('.drawing-cont');
const slider = document.querySelector('.slider')
const colorButtons = document.querySelectorAll('.color-btn');
const shadingToggle = document.querySelector(".shade-btn");

//DEFAULT VALUES AND GLOBAL VARIABLES
let color = 'rgb(0, 0, 0)';
let shading = true;
let gridResolution = 16;
let drawingContainerWidth;
let columnWidth;
let gridDiv;


//STARTING EVENT LISTENERS
window.addEventListener('mouseup',stopColor);
window.addEventListener('resize',resizeGrid);
slider.addEventListener('input',slideErase);
colorButtons.forEach(function(thisObj){
    thisObj.addEventListener('click',setColor)
})

shadingToggle.addEventListener('click',shadeOnOFf)

//INITIALIZING FUNCTIONS
createBlocks();
setColumnsRows()
setGridBlockProperties();
setGridBlockEvents();
setSliderParameters()
