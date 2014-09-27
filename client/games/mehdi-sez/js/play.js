Game.Play = function (game){};

var simon;
var N = 1;
var userCount = 0;
var currentCount = 0;
var sequenceCount = 16;
var sequenceList = [];
var simonSez = false;
var timeCheck;
var litSquare;
var winner;
var loser;
var intro;

Game.Play.prototype = {
    create: function() {

        simon = game.add.group();
        var item;

        for (var i = 0; i < 3; i++)
        {
            item = simon.create(150 + 168 * i, 150, 'item', i);
            // Enable input.
            item.inputEnabled = true;
            item.input.start(0, true);
            item.events.onInputDown.add(this.select.bind(this));
            item.events.onInputUp.add(this.release.bind(this));
            item.events.onInputOut.add(this.moveOff.bind(this));
            simon.getAt(i).alpha = 0;
        }

        for (var i = 0; i < 3; i++)
        {
            item = simon.create(150 + 168 * i, 318, 'item', i + 3);
            // Enable input.
            item.inputEnabled = true;
            item.input.start(0, true);
            item.events.onInputDown.add(this.select.bind(this));
            item.events.onInputUp.add(this.release.bind(this));
            item.events.onInputOut.add(this.moveOff.bind(this));
            simon.getAt(i + 3).alpha = 0;
        }

        this.introTween();
        this.setUp();
        var that = this;
        setTimeout(function(){that.simonSequence(); intro = false;}, 5000);

    },

    restart: function() {
        var that = this;
        N = 1;
        userCount = 0;
        currentCount = 0;
        sequenceList = [];
        winner = false;
        loser = false;
        this.introTween();
        this.setUp();
        setTimeout(function(){that.simonSequence(); intro=false;}, 5000);

    },

    introTween: function() {

        intro = true;

        for (var i = 0; i < 6; i++)
        {
            game.add.tween(simon.getAt(i)).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 4, true).to( { alpha: .25 }, 500, Phaser.Easing.Linear.None, true);
        }

    },

    update: function() {
        var that = this;

        if (simonSez)
        {
            if (game.time.now - timeCheck >700-N*40)
            {
                simon.getAt(litSquare).alpha = .25;
                game.paused = true;

                setTimeout(function()
                {
                    if ( currentCount< N)
                    {
                        game.paused = false;
                        that.simonSequence();
                    }
                    else
                    {
                        simonSez = false;
                        game.paused = false;
                    }
                }, 400 - N * 20);
            }
        }
    },

    playerSequence: function(selected) {
        var that = this;
        correctSquare = sequenceList[userCount];
        userCount++;
        thisSquare = simon.getIndex(selected);

        if (thisSquare == correctSquare)
        {
            if (userCount == N)
            {
                if (N == sequenceCount)
                {
                    winner = true;
                    setTimeout(function(){that.restart();}, 3000);
                }
                else
                {
                    userCount = 0;
                    currentCount = 0;
                    N++;
                    simonSez = true;
                }
            }
        }
        else
        {
            loser = true;
            setTimeout(function(){that.restart();}, 3000);
        }

    },

    simonSequence: function () {

        console.log(currentCount);
        simonSez = true;
        litSquare = sequenceList[currentCount];
        simon.getAt(litSquare).alpha = 1;
        timeCheck = game.time.now;
        currentCount++;


    },

    setUp: function() {

        for (var i = 0; i < sequenceCount; i++)
        {
            thisSquare = game.rnd.integerInRange(0,5);
            sequenceList.push(thisSquare);
        }

        console.log(sequenceList);

    },

    select: function(item, pointer) {

        if (!simonSez && !intro && !loser && !winner)
        {
            item.alpha = 1;
        }

    },

    release: function(item, pointer) {

        if (!simonSez && !intro && !loser && !winner)
        {
            item.alpha = .25;
            this.playerSequence(item);
        }
    },

    moveOff: function(item, pointer) {

        if (!simonSez && !intro && !loser && !winner)
        {
            item.alpha = .25;
        }

    },
    render: function() {

        if (!intro)
        {
            if (simonSez)
            {
                game.debug.text('Simon Sez', 360, 96, 'rgb(255,0,0)');
            }
            else
            {
                game.debug.text('Your Turn', 360, 96, 'rgb(0,255,0)');
            }
        }
        else
        {
            game.debug.text('Get Ready', 360, 96, 'rgb(0,0,255)');
        }

        if (winner)
        {
            game.debug.text('You Win!', 360, 32, 'rgb(0,0,255)');
        }
        else if (loser)
        {
            game.debug.text('You Lose!', 360, 32, 'rgb(0,0,255)');
        }

    }
};

//@ sourceURL=play.js