/****************************/
/*GRID EDITING FUNCIONS
/****************************/

//Sets the current color in the pallette
function setColor(e){
    colorName = this.textContent.toLowerCase();
    
    if(colorName=='black'){
        color = 'rgb(0, 0, 0)';
    }
    
    if(colorName=='white'){
        color = 'rgb(255, 255, 255)';
    }
    
    if(colorName=='red'){
        color = 'rgb(255, 0, 0)';
    }
    
    if(colorName=='brown'){
        color =  'rgb(165, 42, 42)';
    }
    
    if(colorName=='orange'){
        color =  'rgb(255, 165, 0)';
    }
    
    if(colorName=='yellow'){
        color = 'rgb(255, 255, 0)';
    }
    
    if(colorName=='cyan'){
        color =  'rgb(0, 255, 255)';
    }
    
    if(colorName=='green'){
        color =  'rgb(0, 255, 0)';
    }
    
    if(colorName=='blue'){
        color =  'rgb(0, 0, 255)';
    }
    
    if(colorName=='purple'){
        color = 'rgb(128, 0, 128)';
    }
    
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
function startColor(e){
    //Allows colors to be shaded more over repeated areas if shading is enabled
    if(this.classList[1]=='marked' && shading==true){
        let previousRgb = this.style.backgroundColor.match(/\d*/g);
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
    let axis = parseInt(slider.value);
    let i=1;
    gridDiv.forEach(function(thisObj){
        if(i==axis){
            thisObj.style.backgroundColor = "rgb(255, 255, 255";
            thisObj.classList.remove('marked');
            axis+=gridSizeXSize;
            }
        i++  
        }    
    ) 
}

//Allows grid and blocks to be resized when window is changed
function resizeGrid(){
    setColmunWidth();
    setGridBlockWidth()
    setSliderParameters();
}

//Clears canvas and creates new grid. 
function NewCanvas(){
    //Stoes orginal grid in case user enters invalid value
    let newGridSizeXSize=parseInt(document.querySelector('.grid-dim').value);
    if(isNaN(newGridSizeXSize)||newGridSizeXSize>99 || newGridSizeXSize<1){
        alert("Invalid value. Please input a number between 1 and 99");
    }
    else{
        gridSizeXSize = newGridSizeXSize;
        //Updates the text box to match the height input
        document.querySelector('.disabled').placeholder = gridSizeXSize;
        clearBlocks()
        createBlocks();
        setColmunWidth()
        setGridBlockWidth();
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
    for(let i=0;i<(gridSizeXSize*gridSizeXSize);i++){ 
            drawingContainer.appendChild(document.createElement('div'));
        }
    
    //Converts node array to regular array
    gridDiv = Array.from(drawingContainer.children);    
    
}

//Calculates and sets the grid column width based on container size for new canvas or window resizing
function setColmunWidth(){
    drawingContainerWidth=getComputedStyle(drawingContainer).width.match(/\d*/);
    columnWidth = drawingContainerWidth[0]/gridSizeXSize;
    columnsCssString = "";

    //Creates string for CSS property
    for(let i=0;i<(gridSizeXSize);i++){ 
        columnsCssString += columnWidth+"px ";
    }

    drawingContainer.style.gridTemplateColumns = columnsCssString;
}

//Sets individual grid block width and height based on grid column width. Adds additional CSS properties using a class
function setGridBlockWidth(){
    gridDiv.forEach(function(thisObj){
        thisObj.classList.add('grid-block');
        thisObj.style.height = columnWidth+"px";
        thisObj.style.width = columnWidth+"px";
        }
    )
}

function setGridBlockEvents(){
    //gridDiv = Array.from(drawingContainer.children);
    gridDiv.forEach(function(thisObj){
        thisObj.addEventListener('mousedown',startColor);
        thisObj.addEventListener('touchstart',startColor);
        }
    )
}

/****************************/
/*SLIDER BUILDING FUNCIONS
/****************************/
function setSliderParameters(){
    slider.max=gridSizeXSize+1;
    slider.style.width=columnWidth*(gridSizeXSize)+"px" 
}

//SELECTORS
const drawingContainer = document.querySelector('.drawing-cont');
const slider = document.querySelector('.slider')
const colorButtons = document.querySelectorAll('.color-btn');
const shadingToggle = document.querySelector(".shade-btn");

//DEFAULT VALUES AND GLOBAL VARIABLES
let gridSizeXSize = 16;
let drawingContainerWidth;
let columnWidth;
let columnsCssString = "";
let gridDiv=[];
let colorName = 'black';
let color = 'rgb(0, 0, 0)';
let shading = true;

//STARTING EVENT LISTENERS

window.addEventListener('mouseup',stopColor);
window.addEventListener('touchend',stopColor);
window.addEventListener('resize',resizeGrid);
slider.addEventListener('input',slideErase);
colorButtons.forEach(function(thisObj){
    thisObj.addEventListener('click',setColor)
})

shadingToggle.addEventListener('click',shadeOnOFf)

//INITIALIZING FUNCTIONS
createBlocks();
setColmunWidth()
setGridBlockWidth();
setGridBlockEvents();
setSliderParameters()
