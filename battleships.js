var model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
  
    ships: [
      { locations: [0, 0, 0], hits: ["", "", ""] },
      { locations: [0, 0, 0], hits: ["", "", ""] },
      { locations: [0, 0, 0], hits: ["", "", ""] }
    ],
  
    fire: function(guess) {
      for (var i = 0; i < this.numShips; i++) {
        var ship = this.ships[i];
        var locations = ship.locations;
        var index = locations.indexOf(guess);
  
        if (index >= 0) {
          ship.hits[index] = "hit";
          view.displayHit(guess);
          view.displayMessage("HIT!");
  
          if (this.isSunk(ship)) {
            view.displayMessage("You sunk my battleship!");
            this.shipsSunk++;
          }
          return true;
        }
      }
      view.displayMiss(guess);
      view.displayMessage("You missed.");
      return false;
    },
  
    isSunk: function(ship) {
      for (var i = 0; i < this.shipLength; i++) {
        if (ship.hits[i] !== "hit") {
          return false;
        }
      }
      return true;
  },
  
  generateShipLocations: function() {
      var locations;
      for (var i = 0; i < this.numShips; i++) {
          do {
            locations = this.generateShip();
          } while (this.collision(locations));
          this.ships[i].locations = locations;
        }
      },
      
      generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row;
        var col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
            col = Math.floor(Math.random() * this.boardSize);
        }
        
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        
        return newShipLocations;
    },
    
    collision: function(locations) {
        for (var i = 0; i <this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j <locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
        }
    };

    var view = {
      displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
      },
    
      displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
      },
    
      displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
      }
    };
  var controller = {
      guesses: 0,
  
      processGuess: function(guess) {
          var location = parseGuess(guess);
          if (location) 
          {
              this.guesses++;
              var hit = model.fire(location);
              if (hit && model.shipSunk === model.numShips) {
                  view.displayMessage(" You sank all my battleships, in + " + this.guesses + " guesses");
              }
                  }
          }
      };
    
    
    
    function parseGuess(guess) {
        var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
        
        if (guess === null || guess.length !== 2) {
            alert("Please enter a letter and a number on the board.");
        } else {
            var firstChar = guess.charAt(0);
            var row = alphabet.indexOf(firstChar);
            var column = guess.charAt(1);
            
            if (isNaN(row) || isNaN(column)) {
                alert("That's not on the board. Please try again.");
            }
            else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
                alert("Oops, that's off the board. Please try again.");
                
            } else {
                return row + column;
            }
        }
        return null;
    }
    
    
    function init() {
            var firebutton = document.getElementById("fireButton");
            firebutton.onclick = handleFirebutton;
            var guessInput = document.getElementById("guessInput");
            guessInput.onkeypress = handleKeyPress;
            model.generateShipLocations();
        }
        
        function handleKeyPress(e) {
            var firebutton = document.getElementById("fireButton");
            if (e.keyCode === 13) {
                firebutton.clock();
                return false;
            }
        }

        function handleFirebutton() {
            var guessInput = document.getElementById("guessInput");
            var guess = guessInput.value;
            controller.processGuess(guess);
            
            guessInput.value = "";
            
        }
        
        window.onload = init;
        
        