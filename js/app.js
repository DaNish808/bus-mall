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
        var roundedPercentage = Math.floor(rawPercentage * 100) /100 + '%';
        return roundedPercentage;
    }
}


var surveyor = {
    products: [],
    usedOptionIndices: [],      // logs every displayed product in order
    numOptions: 3,      // sets number of options displayed per vote
    numVotes: 500,      // sets number of votes per survey
    voteCount: 0,       // iterates with each vote until (voteCount === numVotes)

    results: [ ['Product', 'Votes', 'Shown', 'Percentage'] ],       // temporary array for tablulating voting results in console (logResults method)

    elVoteBox: document.getElementById('vote-box'),     // parent container of image options
    elOptionImages: [],         // elOptionImages and elOptionDescritions are populated in the setOptionElement method
    elOptionDescriptions: [],   // called by populateElementVariables().

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

    calcProductsShown: function() {     // called after all votes have been cast
                                        // for each option that was shown, push the voteCount that it occurred on to that product's shown property
                                        // the length of productName.shown is used by its getShowCount() method/
        for(var i = 0; i < surveyor.usedOptionIndices.length; i++) {
            surveyor.products[surveyor.usedOptionIndices[i]].shown.push(surveyor.usedOptionIndices[i]);
        }
    },

    switchLayout: function() {
        surveyor.elVoteBox.innerHTML = '';
        surveyor.elVoteBox.setAttribute('class', 'hidden');
        surveyor.elResultsBox.removeAttribute('class');
        document.getElementById('voting-header').setAttribute('class', 'hidden');
        document.getElementById('results-header').removeAttribute('class');
    },

    renderResults: function() {
        var elTable = document.createElement('table');

            var elThead = document.createElement('thead');
                for(var i = 0; i < surveyor.results[0].length; i++) {
                    var elTh = document.createElement('th');
                        elTh.innerText = surveyor.results[0][i];
                    elThead.appendChild(elTh);
                }
            elTable.appendChild(elThead);

            for(var i = 1; i <= names.length; i++) {
                var elTr = document.createElement('tr');
                    for(var j = 0; j < surveyor.results[0].length; j++) {
                        var elTd = document.createElement('td');
                            if(j < 1) {
                                elTd.innerText = surveyor.results[i][j];
                                elTd.setAttribute('class', 'popup-image')
                                var elImg = document.createElement('img');
                                    elImg.setAttribute('src', surveyor.products[i-1].image);
                                    elImg.setAttribute('class', 'table-image');
                                elTd.appendChild(elImg);
                            }
                            else {
                                elTd.innerText = surveyor.results[i][j];
                            }
                        elTr.appendChild(elTd);
                    }
                elTable.appendChild(elTr);
            }


        surveyor.elResultsBox.appendChild(elTable);
    },

    logResults: function(e) {      // temporarily displays survey results to console
        for(var i = 0; i < names.length; i++) {
            var productData = [];
            productData.push(surveyor.products[i].name);
            productData.push(surveyor.products[i].getVoteCount());
            productData.push(surveyor.products[i].getShowCount());
            productData.push(surveyor.products[i].getPercentVote());
            surveyor.results.push(productData);
        }
        console.table(surveyor.results);
    },

    vote: function(e) {     // fires when user clicks an image
        surveyor.products[parseInt(e.target.getAttribute('data-index'))].voted.push(surveyor.voteCount);
        // pushes the current voteCount onto the clicked product's voted log.
        // productName.voted.length is used by the getVoteCount Property method
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
        }
    },

    setListener: function() {
        this.elVoteBox.addEventListener('click', surveyor.vote, false);
    },

    survey: function() {                   // initializes survey by 
        this.voteCount = 0;                // restarting the vote counter
        this.populateElementVariables();   // creating and assigning the necessary elements to properties in the survey object
        this.instantiateProducts();        // creating the product objects in the .products property
        this.setListener();                // setting up the 'click' event listener
        this.renderOptions();              // and rendering the first set of voting options to the page
    },

    testSurvey: function(iterations) {     // fires when user clicks an image
        surveyor.survey();
        for(iterations; iterations > 0; iterations--) {
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
    }
}

surveyor.survey();      