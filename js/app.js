const names = ['bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
const images = ['./images/bathroom.jpg', './images/boots.jpg', './images/breakfast.jpg', './images/bubblegum.jpg', './images/chair.jpg', './images/cthulhu.jpg', './images/dog-duck.jpg', './images/dragon.jpg', './images/pen.jpg', './images/pet-sweep.jpg', './images/scissors.jpg', './images/shark.jpg', './images/sweep.png', './images/tauntaun.jpg', './images/unicorn.jpg', './images/usb.gif', './images/water-can.jpg', './images/wine-glass.jpg'];
const descriptions = ['bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
const ids = ['bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];




function Product(name, image, description, id) {
    this.name = name;
    this.image = image;
    this.description = description;
    this.id = id;
    this.voted = [];
    this.shown = [];
}

Product.prototype.getVoteCount = function() {
    return this.voted.length;
}

Product.prototype.getShowCount = function() {
    return this.shown.length;
}

Product.prototype.getPercentVote = function() {
    if(this.getShowCount() === 0) {
        return 'never shown';
    }
    else {
        var rawPercentage = (this.getVoteCount() / this.getShowCount()) * 100;
        var roundedPercentage = Math.floor(rawPercentage * 100) /100;
        return roundedPercentage;
    }
}




var surveyor = {
    participant: 'hi',
    allParticipants: [],
    products: [],
    usedOptionIndices: [],      // logs every displayed product in order
    numOptions: 3,      // sets number of options displayed per vote
    numVotes: 25,      // sets number of votes per survey
    voteCount: 0,       // iterates with each vote until (voteCount === numVotes)

    data: {
        grossResults: [], // stores all past survey data
        results: [ ['Product', 'Votes', 'Shown', 'Percentage'] ],       // temporary array for tablulating voting results in console (logResults method)
        allVoteResults: [],
        allShownResults: [],
        allPercentageResults: [],
    },

    elVoteBox: document.getElementById('vote-box'),     // parent container of image options
    elOptionImages: [],         // elOptionImages and elOptionDescritions are populated in the setOptionElement method
    elOptionDescriptions: [],   // called by populateElementVariables().

    elResultsChart: document.getElementById('results-chart'),
    chartData: {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'number of votes',
                data: [],
                backgroundColor: 'rgba(255, 0, 0, 1)',
            },
            {
                label: 'times displayed',
                data: [],
                backgroundColor: 'rgba(50, 0, 0, .2)',
            }],
        },
        options: {
            scales: {
                xAxis: [{
                    stacked: true
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                    }
                }]
            }
        }
    },

    elResultsChartAll: document.getElementById('all-results-chart'),
    chartDataAll: {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'participant',
                data: [],
                backgroundColor: 'darkblue',
            }],
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    },

    elResultsChartIndividuals: document.getElementById('individuals-results-chart'),
    chartDataIndividuals: {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'current',
                data: [],
                backgroundColor: 'rgba(255, 0, 0, 1)',
            }],
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                    }
                }]
            }
        }
    },



    elResultsBox: document.getElementById('results-box'),



    setOptionElement: function(index) {                     // sets up the elements for one option including:
        var elOptionBox = document.createElement('div');        // container for image and description
        elOptionBox.setAttribute('id', 'option' + index);       
        elOptionBox.setAttribute('class', 'vote-option');

        var elImageDiv = document.createElement('div');         // div to contain image
        elImageDiv.setAttribute('id', 'option' + index + '-image');
        elImageDiv.setAttribute('class', 'option-image');
        this.elOptionImages.push(elImageDiv);
        elOptionBox.appendChild(elImageDiv);

        var elDescription = document.createElement('div');      // div to contain description
        elDescription.setAttribute('id', 'option' + index + '-description');
        elDescription.setAttribute('class', 'option-description');
        this.elOptionDescriptions.push(elDescription);
        elOptionBox.appendChild(elDescription);

        this.elVoteBox.appendChild(elOptionBox);
    },

    populateElementVariables: function() {      // sets up elements for all votable options
        for(var i = 0; i < this.numOptions; i++) {
            this.setOptionElement(i);
        }
    },

    instantiateProducts: function() {           // constructs products and adds them to an array
        this.products = [];
        for(var i = 0; i < names.length; i++) {
            this.products[i] = new Product (names[i], images[i], descriptions[i], ids[i]);
        }
    },

    canUse: function(newOptionIndex, currentOptionNum) {        // returns true if newOptionIndex has not been used 
                                                        // in either the last two turns or the current option group
        var unavailableIndices = this.usedOptionIndices.slice( -((2 * this.numOptions) + currentOptionNum));

        if(unavailableIndices.includes(newOptionIndex)) {
            return false;
        }
        else {
            return true;
        }
    },

    getRandomIndices: function() {      // returns a set of random integers within the range of the set of product options
        var i = 0;                      // of length equal to the number of votable options
        do {
            var newOptionIndex = Math.floor(Math.random() * this.products.length);
            if(this.canUse(newOptionIndex, i + 1)) {
                this.usedOptionIndices.push(newOptionIndex);
                i++;
            }
        } while(i < this.numOptions);
        var newRandomIndices = this.usedOptionIndices.slice(-this.numOptions);
        // console.log('in getRandomIndices; usedOptionIndices=' + this.usedOptionIndices);
        // console.log('in getRandomIndices; newRandomIndices=' + newRandomIndices);
        return newRandomIndices;
    },

    renderProduct: function(productIndex, optionIndex) {        // renders product image and desription to respective option index
        var elImage = document.createElement('img');            // along with it's data-index from the surveyor.products array
        elImage.setAttribute('data-index', productIndex);

        elImage.setAttribute('src', this.products[productIndex].image);
        elImage.setAttribute('alt', this.products[productIndex].description);
        elImage.setAttribute('id', this.products[productIndex].id);
        this.elOptionImages[optionIndex].innerHTML = '';        // empties the needed image element's contents
        this.elOptionImages[optionIndex].appendChild(elImage);
        this.elOptionImages[optionIndex].parentElement.setAttribute('data-index', productIndex);

        this.elOptionDescriptions[optionIndex].innerText = this.products[productIndex].description;
        this.elOptionDescriptions[optionIndex].setAttribute('data-index', productIndex);
    },

    renderOptions: function() {     // renders all votable options to page
        var randomProductSet = this.getRandomIndices();
        for(var i = 0; i < this.numOptions; i++) {
            this.renderProduct(randomProductSet[i], i);
        }
    },


    // must be done after calculating data.results
    // takes "grossResults" from local storage and parses it into data.grossResults
    dataFromLocalStorage: function() {
        var dataString = localStorage.getItem('grossResults');
        if(dataString) {
            this.data.grossResults = JSON.parse(dataString);
        }
        var dataString = localStorage.getItem('allParticipants');
        if(dataString) {
            this.allParticipants = JSON.parse(dataString);
        }
    },
    
    // stores data.results and updates data.grossResults in local storage
    dataToLocalStorage: function() {        
        // use dataString to store grossResults
        this.data.grossResults.push(this.data.results);
        dataString = JSON.stringify(this.data.grossResults);
        localStorage.setItem('grossResults', dataString);

        this.allParticipants.push(this.participant);
        dataString = JSON.stringify(this.allParticipants);
        localStorage.setItem('allParticipants', dataString);
    },

    // sorts through data from grossResults to get summary totals
    // stored data in this.data.all* properties
    getAllResults: function() {
        var allVotes = [],
            allShown = [],
            allPercentages = [];

        for(var k = 0; k < (this.data.results.length - 1); k++) {
            allVotes[k] = 0;
            allShown[k] = 0;
            allPercentages[k] = 0;
        }

        for(var i = 0; i < this.data.grossResults.length; i++) {
            for(var j = 1; j < this.data.grossResults[i].length; j++) {
                allVotes[j - 1] += this.data.grossResults[i][j][1];
                allShown[j - 1] += this.data.grossResults[i][j][2];
                allPercentages[j - 1] = ((allPercentages * i) + this.data.grossResults[i][j][3]) / (i+1);
            }
        }
        this.data.allVoteResults.push(allVotes);
        this.data.allShownResults.push(allShown);
        this.data.allPercentageResults.push(allPercentages);
    },

    calcProductsShown: function() {     // called after all votes have been cast
                                        // for each option that was shown, push the voteCount that it occurred on to that product's shown property
                                        // the length of productName.shown is used by its getShowCount() method/
        for(var i = 0; i < surveyor.usedOptionIndices.length; i++) {
            surveyor.products[surveyor.usedOptionIndices[i]].shown.push(surveyor.usedOptionIndices[i]);
        }
    },



    switchLayout: function() {
        document.getElementById('voting-header').setAttribute('class', 'hidden');
        document.getElementById('results-header').removeAttribute('class');
        document.getElementById('canvas').removeAttribute('class');
        document.getElementById('canvas-all').removeAttribute('class');
        document.getElementById('canvas-individuals').removeAttribute('class');
        document.getElementById('canvasTest').setAttribute('class', 'hidden');
        document.getElementById('animation-controls').setAttribute('class', 'hidden');
        document.getElementById('for-dev').setAttribute('class', 'hidden');
        document.getElementById('history-header').removeAttribute('class');
        clearInterval(animation);
        surveyor.elVoteBox.setAttribute('class', 'hidden');
        surveyor.elResultsChart.removeAttribute('class');
        surveyor.elResultsChartAll.removeAttribute('class');
        surveyor.elResultsChartIndividuals.removeAttribute('class');
        surveyor.elResultsBox.removeAttribute('class');
    },

    renderResults: function() {
        var elTable = document.createElement('table');

            var elThead = document.createElement('thead');
                for(var i = 0; i < surveyor.data.results[0].length; i++) {
                    var elTh = document.createElement('th');
                        elTh.innerText = surveyor.data.results[0][i];
                    elThead.appendChild(elTh);
                }
            elTable.appendChild(elThead);

            for(var i = 1; i <= names.length; i++) {
                var elTr = document.createElement('tr');
                    for(var j = 0; j < surveyor.data.results[0].length; j++) {
                        var elTd = document.createElement('td');
                            if(j < 1) {
                                elTd.innerText = surveyor.data.results[i][j];
                                elTd.setAttribute('class', 'popup-image')
                                var elImg = document.createElement('img');
                                    elImg.setAttribute('src', surveyor.products[i-1].image);
                                    elImg.setAttribute('class', 'table-image');
                                elTd.appendChild(elImg);
                            }
                            else {
                                elTd.innerText = surveyor.data.results[i][j];
                            }
                        elTr.appendChild(elTd);
                    }
                elTable.appendChild(elTr);
            }

        surveyor.elResultsBox.innerHTML = '';
        surveyor.elResultsBox.appendChild(elTable);
    },



    calcChartData: function(type) {
        if(type === 'current') {
            for(var i = 1; i <= names.length; i++) {
                this.chartData.data.datasets[0].data.push(this.data.results[i][1]);
            }
            for(var i = 1; i <= names.length; i++) {
                this.chartData.data.datasets[1].data.push(this.data.results[i][2]);
            }
        }
        else if(type === 'all') {
            this.chartDataAll.data.datasets[0].label = 'Sum of All Previous Surveys';
            for(var i = 0; i <= names.length; i++) {
                this.chartDataAll.data.datasets[0].data.push(this.data.allVoteResults[0][i]);
            }
        }
        else if(type === 'individuals') {
            // current person
            this.chartDataIndividuals.data.datasets[0].label = this.participant;
            for(var i = 1; i <= names.length; i++) {
                this.chartDataIndividuals.data.datasets[0].data.push(this.data.results[i][1]);
            }
                // past individuals
            var numIndividuals = this.data.grossResults.length 
            for(var i = (numIndividuals - 2); i >= 0; i--) {
                var individual = {
                    label: '',
                    data: [],
                    backgroundColor: 'hsla(' + i + ', 30%, 40%, 0.5)',
                }

                this.chartDataIndividuals.data.datasets;
                individual.label = this.allParticipants[i];
                individual.data = [];
                for(var j = 1; j <= names.length; j++) {
                    individual.data.push(this.data.grossResults[i][j][1]);
                }
                individual.backgroundColor = 'hsla(' + (i * (360 / numIndividuals)) + ', 60%, 50%, 0.3)';

                console.log('*****in iteration ' + i + ': ')
                console.log('label: ' + individual.label);
                console.log('data: ' + individual.data);
                console.log(individual);                
                this.chartDataIndividuals.data.datasets.push(individual);
                console.log('*****in iteration ' + i + ': ')
                console.log(this.chartDataIndividuals.data.datasets);
                console.log({test: true})
            }
        }
    },

    renderChart: function() {
        var elCanvas = document.getElementById('canvas');
        this.calcChartData('current');
        var productsChart = new Chart(elCanvas, this.chartData);

        var elCanvasAll = document.getElementById('canvas-all');
        this.calcChartData('all');
        var productsChart = new Chart(elCanvasAll, this.chartDataAll);

        var elCanvasIndividuals = document.getElementById('canvas-individuals');
        this.calcChartData('individuals');
        var productsChart = new Chart(elCanvasIndividuals, this.chartDataIndividuals);
    },

    logResults: function(e) {      // temporarily displays survey results to console
        for(var i = 0; i < names.length; i++) {
            var productData = [];
            productData.push(surveyor.products[i].name);
            productData.push(surveyor.products[i].getVoteCount());
            productData.push(surveyor.products[i].getShowCount());
            productData.push(surveyor.products[i].getPercentVote());
            surveyor.data.results.push(productData);
        }
        // console.table(surveyor.data.results);
    },



    vote: function(e) {     // fires when user clicks an image
        // pushes the current voteCount onto the clicked product's voted log.
        // productName.voted.length is used by the getVoteCount Property method
        if(e.target.id === 'vote-box') {}
        else {
            surveyor.products[parseInt(e.target.getAttribute('data-index'))].voted.push(surveyor.voteCount);
            console.log(surveyor.voteCount);
            if(surveyor.voteCount + 1 < surveyor.numVotes) {    // if the user still has votes left
                surveyor.voteCount++;                           // increment the voteCount
                surveyor.renderOptions();                       // and display next set of voting options
            }
            else {                                              // else if the user has used up all their votes
                console.log('survey over');                     // use the displayed products log (.usedOptionIndices) to calculate
                surveyor.calcProductsShown();                   // the show count for each product
                surveyor.elVoteBox.removeEventListener('click', surveyor.vote, false);  // remove event listener
                surveyor.switchLayout();                        // removes vote-box and adds results-box
                surveyor.logResults();                         // and show results
                surveyor.renderResults();
                surveyor.dataFromLocalStorage();
                surveyor.dataToLocalStorage();
                surveyor.getAllResults();
                surveyor.renderChart();
            }
        }
    },

    setListener: function() {
        this.elVoteBox.addEventListener('click', surveyor.vote, false);
    },

    survey: function() {                   // initializes survey by 
        this.participant = prompt('Hi! What\'s your name?');
        this.voteCount = 0;                // restarting the vote counter
        this.populateElementVariables();   // creating and assigning the necessary elements to properties in the survey object
        this.instantiateProducts();        // creating the product objects in the .products property
        this.setListener();                // setting up the 'click' event listener
        this.renderOptions();              // and rendering the first set of voting options to the page
    },



    testSurvey: function(iterations) {     // fires when user clicks an image
        for(iterations -= surveyor.voteCount ; iterations > 0; iterations--) {
            surveyor.products[parseInt(surveyor.elOptionDescriptions[0].getAttribute('data-index'))].voted.push(surveyor.voteCount);
            // pushes the current voteCount onto the clicked product's voted log.
            // productName.voted.length is used by the getVoteCount Property method
            console.log(surveyor.voteCount);
            surveyor.voteCount++;                           // increment the voteCount
            surveyor.renderOptions();                       // and display next set of voting options
        }                                  // else if the user has used up all their votes
        console.log('survey over');                     // use the displayed products log (.usedOptionIndices) to calculate
        surveyor.calcProductsShown();                   // the show count for each product
        surveyor.elVoteBox.removeEventListener('click', surveyor.vote, false);  // remove event listener
        surveyor.switchLayout();                        // removes vote-box and adds results-box
        surveyor.logResults();                         // and show results
        surveyor.renderResults();
        surveyor.dataFromLocalStorage();
        surveyor.dataToLocalStorage();
        surveyor.getAllResults();
        surveyor.renderChart();
    },

    listenAutoRun: function() {
        var elForm = document.getElementsByTagName('form')[0];
        elForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log(parseInt(this.iterations.value));
            surveyor.testSurvey(parseInt(this.iterations.value));
        });
    }
}



surveyor.survey();      
surveyor.listenAutoRun();





















// canvas is   800 x 300
// <canvas id='canvasTest' height='300' width='800'></canvas>
// <div id='animation-controls'>
//     <button id='startAnimation'>play</button>
//     <button id='endAnimation'>pause</button>
// </div>


var elCanvas = document.getElementById('canvasTest');
var context = elCanvas.getContext('2d');

function randomZ ( min, max ) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat (min, max) {
    return (Math.random() * (max - min + 1)) + min;
}

var redStraightLines = {
    x: 400,
    y: 150,
    draw: function() {
        context.beginPath();
        context.moveTo(this.x, this.y);
        this.x = randomZ(0,800);
        this.y = randomZ(0,300);
        context.lineTo(this.x, this.y);
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.stroke();
        
        context.beginPath();
        context.arc(this.x, this.y, 5, 0, 2 * Math.PI, false);
        context.fillStyle = 'red';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'red';
        context.stroke();
    }
}

var greenWorm = {
    x: 400,
    y: 150,
    stepSize: 30,
    draw: function() {
        context.beginPath();
        context.moveTo(this.x, this.y);
        this.getNextCoordinates();
        context.lineTo(this.x, this.y);
        context.strokeStyle = 'green';
        context.lineCap = 'round';
        context.lineWidth = 10;
        context.stroke();
        
        context.beginPath();
        context.arc(this.x, this.y, 5, 0, 2 * Math.PI, false);
        context.fillStyle = 'yellow';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'yellow';
        context.stroke();
    },
    getNextCoordinates: function() {
        var tempX,
            tempY;
        do {
            tempX = randomZ(this.x - this.stepSize, this.x + this.stepSize);
            tempY = randomZ(this.y - this.stepSize, this.y + this.stepSize);
        } while(tempX < 0 || tempX > 800 ||tempY < 0 ||tempY > 300);
        this.x = tempX;
        this.y = tempY;
    }
}

var blueRectanglePath = {
    xi: 0,
    yi: 0,
    xf: 400,
    yf: 150,
    stepSize: 100,

    draw: function() {
        this.getNextCoordinates();
        context.fillStyle = 'rgba(0,0,255,0.5)';
        context.strokeStyle = 'blue';
        context.lineWidth = 5;
        context.fillRect(this.xi, this.yi, this.xf, this.yf);
    },
    getNextCoordinates: function() {
        var tempX = 0;
        var tempY = 0;
        this.xi += this.xf;
        this.yi += this.yf;
        console.log('test');
        do {
            tempX = randomZ(-this.stepSize, this.stepSize);
            tempY = randomZ(-this.stepSize, this.stepSize);
        } while(this.xi + tempX < 0 || this.xi + tempX > 800 || this.yi + tempY < 0 || this.yi + tempY > 300);
        this.xf = tempX;
        this.yf = tempY;
        console.log(this.xf + ',' + this.yf);
    }
}

var purpleCircleChain = {
    minRadius: 15,
    maxRadius: 60,

    previousXYR: [0, 0, 0],

    currentXYR: [400, 150, 30],

    calcDistance: function(xA, yA, xB, yB) {
        console.log('in calcDistance method')

        return Math.pow( (Math.pow((xA - xB), 2) + Math.pow((yA - yB), 2)),  0.5);
    },

    getNextCenter: function() {
        console.log('in getNextCenter method')
        var tempX,
            tempY,
            tempD;
        this.previousXYR = this.currentXYR;
        do {
            tempX = randomZ(this.previousXYR[0] - (this.previousXYR[2] + this.maxRadius),
                            this.previousXYR[0] + (this.previousXYR[2] + this.maxRadius));
            tempY = randomZ(this.previousXYR[1] - (this.previousXYR[2] + this.maxRadius),
                            this.previousXYR[1] + (this.previousXYR[2] + this.maxRadius));
            tempD = this.calcDistance(this.previousXYR[0], this.previousXYR[1], tempX, tempY);
            console.log(tempD);
            console.log((this.previousXYR[2] + this.minRadius) + ',' + 
                        (this.previousXYR[2] + this.maxRadius))
        } while(tempD < (this.previousXYR[2] + this.minRadius) || 
                tempD > (this.previousXYR[2] + this.maxRadius) ||
                tempX < (tempD - this.previousXYR[2]) || 
                tempX > (800 - (tempD - this.previousXYR[2])) ||
                tempY < (tempD - this.previousXYR[2]) ||
                tempY > (300 - (tempD - this.previousXYR[2])));

        this.currentXYR = [tempX, tempY, (tempD - this.previousXYR[2])];
    },

    draw: function() {
        console.log(this.previousXYR[0], this.previousXYR[1],  this.previousXYR[2], 
                    this.currentXYR[0],  this.currentXYR[1],  this.currentXYR[2], )
        this.getNextCenter();
        context.beginPath();
        context.arc(this.currentXYR[0], this.currentXYR[1], this.currentXYR[2], 0, 2 * Math.PI, false);
        context.lineWidth = 1;
        context.strokeStyle = 'rgba(255, 0, 255, 1)';
        context.stroke();
    },
}

var rainbowArcClock = {
    maxAngle: 2*Math.PI,
    minAngle: Math.PI / 8,
    maxRadius: 70,
    minRadius: 5,

    colorIncrementer: 0,
    colorSpacer: 3,
    previousXYRA: [0,0,0,0,0],
    currentXYRA: [400, 150, 30, 0, 2*Math.PI],

    getNextParameters: function() {

        this.previousXYRA = this.currentXYRA;
        var tempX = 0,
            tempY = 0;
        do {
            var newRadius = randomFloat(this.minRadius, this.maxRadius);

            tempX = this.previousXYRA[0] + (this.previousXYRA[2] - newRadius) * Math.cos(this.previousXYRA[4]);
            tempY = this.previousXYRA[1] - (newRadius - this.previousXYRA[2]) * Math.sin(this.previousXYRA[4]);
        } while(tempX < (newRadius - this.previousXYRA[2]) || 
                tempX > (800 - (newRadius - this.previousXYRA[2])) ||
                tempY < (newRadius - this.previousXYRA[2]) ||
                tempY > (300 - (newRadius - this.previousXYRA[2])));
        var newAngle = randomFloat(this.minAngle, this.maxAngle);
        this.currentXYRA[0] = tempX;
        this.currentXYRA[1] = tempY;
        this.currentXYRA[2] = newRadius;
        this.currentXYRA[3] = this.previousXYRA[4];
        this.currentXYRA[4] = newAngle;

    },

    draw: function() {
        this.getNextParameters();
        context.beginPath();
        context.arc(this.currentXYRA[0], 
                    this.currentXYRA[1], 
                    this.currentXYRA[2], 
                    this.currentXYRA[3], 
                    this.currentXYRA[4], 
                    false);
        context.lineWidth = 4;
        context.lineCap = 'round';
        context.strokeStyle = 'hsl(' + (this.colorIncrementer * this.colorSpacer) + ', 100%, 70%)';
        context.stroke();
        this.colorIncrementer--;
    },
}

function fadeWhite() {
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.fillRect(0,0,800,300);
}


var fadeRainbow = {
    counter: 180,
    initiate: function() {
        context.shadowOffsetX; 0;
        context.shadowOffsetY; 0;
        context.shadowColor = 'hsla(' + this.counter + ', 100%, 95%, 0.4)';
        context.shadowBlur = 10;
        context.fillStyle = 'hsla(' + this.counter + ', 100%, 95%, 0.4)';
        context.fillRect(0,0,800,300);
        this.counter++;
    },
}


function mainDraw() {
    fadeWhite();
    // fadeRainbow.initiate();
    // redStraightLines.draw();
    // greenWorm.draw();
    // blueRectanglePath.draw();
    // purpleCircleChain.draw();
    rainbowArcClock.draw();
}

// var animation = setInterval(mainDraw, 80);
// setTimeout(setInterval(mainDraw, 5), 10000000);




var animation;
var elControls = document.getElementById('animation-controls');
elControls.addEventListener('click', function(e) {
    e.preventDefault();
    if(e.target.id === 'animation-controls') {
    }
    else {
        if(e.target.id === 'startAnimation') {
            animation = setInterval(mainDraw, 80);
        }
        else if(e.target.id === 'endAnimation') {
            clearInterval(animation);
        }
    }
});

