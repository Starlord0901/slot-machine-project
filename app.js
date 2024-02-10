const symbols = ['A', 'B', 'C', 'D', 'E', 'F'];


function spinReels() {    //function to spin reels and display symbols randomly
    const reels = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        reels.push(symbols[randomIndex]);
    }
    return reels;
}


function determineOutcome(reels) {  //outcome message
   
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
        return { win: true, message: `Congratulations! You won with ${reels.join(', ')}!` };
    } else {
        return { win: false, message: `Sorry, you lost. Better luck next time!` };
    }
}

module.exports = { spinReels, determineOutcome };
