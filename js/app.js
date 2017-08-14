var names = ['bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweet', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
var images = ['./images/bathroom.jpg', './images/boots.jpg', './images/breakfast.jpg', './images/bubblegum.jpg', './images/chair.jpg', './images/cthulhu.jpg', './images/dog-duck.jpg', './images/dragon.jpg', './images/pen.jpg', './images/pet-sweet.jpg', './images/scissors.jpg', './images/shark.jpg', './images/sweep.png', './images/tauntaun.jpg', './images/unicorn.jpg', './images/usb.gif', './images/water-can.jpg', './images/wine-glass.jpg'];
var descriptions = ['bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweet', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
var ids = ['bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweet', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];



function Product(name, image, description, id) {
    this.name = name;
    this.image = image;
    this.description = description;
    this.id = id;
    this.voted = [];
    this.shown = [];
}


var surveyor = {
    products: [],
    usedOptionIndices: [],
    numOptions: 3,
    numVotes: 3,
    voteCount: 0,
    elVoteBox: document.getElementById('vote-box'),
    elOptionImages: [],
    elOptionDescriptions: [],

    setOptionElement: function(index) {
        var elOptionBox = document.createElement('div');
        elOptionBox.setAttribute('id', 'option' + index);
        elOptionBox.setAttribute('class', 'vote-option');

        var elImageDiv = document.createElement('div');
        elImageDiv.setAttribute('id', 'option' + index + '-image');
        elImageDiv.setAttribute('class', 'option-image');
        this.elOptionImages.push(elImageDiv);
        elOptionBox.appendChild(elImageDiv);

        var elDescription = document.createElement('div');
        elDescription.setAttribute('id', 'option' + index + '-description');
        elDescription.setAttribute('class', 'option-description');
        this.elOptionDescriptions.push(elDescription);
        elOptionBox.appendChild(elDescription);

        this.elVoteBox.appendChild(elOptionBox);
    },

    populateElementVariables: function() {
        for(var i = 0; i < this.numOptions; i++) {
            this.setOptionElement(i);
        }
    },

    instantiateProducts: function() {
        for(var i = 0; i < names.length; i++) {
            this.products[i] = new Product (names[i], images[i], descriptions[i], ids[i]);
        }
    },

    setListener: function() {
        this.elVoteBox.addEventListener('click', function(e) {
            e.target.voted.push(this.voteCount);
            // find way to modify shown property of all options
        }, false);
    },

    canUse: function(newOptionIndex, currentOptionNum) {
        var unavailableIndices = this.usedOptionIndices.slice( -( (2*this.numOptions) + currentOptionNum));
        for(var i = 0; i < unavailableIndices.length; i++) {
            if(newOptionIndex === unavailableIndices[i]) {
                return false;
            }
        }
        return true;
    },

    getRandomIndices: function() {
        var i = 0;
        do {
            var newOptionIndex = Math.floor(Math.random() * this.products.length);
            if(this.canUse(newOptionIndex, i + 1)) {
                this.usedOptionIndices.push(newOptionIndex);
                i++;
            }
        } while(i < this.numOptions);
        var newRandomIndices = this.usedOptionIndices.slice(-3);
        return newRandomIndices;
    },

    renderProduct: function(productIndex, optionIndex) {

    },

    showOptions: function() {
        
    },

    survey: function() {
        this.populateElementVariables();
        this.setListener();
        for(voteCount = 0; voteCount < this.numVotes; voteCount++) {
            // this.showOptions();
        }
        // this.removeListener();
    }
}

surveyor.survey();