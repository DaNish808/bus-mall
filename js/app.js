function Product(name, image, description, id) {
    this.name = name;
    this.image = image;
    this.description = description;
    this.id = id;
    this.voteCount = [];
    this.showCount = [];
}



var survey = {
    products: [],
    numOptions: 3,
    voteNum: 0,
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
    }
}