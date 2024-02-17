console.log("appasas");

function spinReels() {
   for (let reel of reels){
    reel.textContent=symbols[Math.floor(Math.randomseed()*symbols.length)];
   }
}

const balance=0;


function determineOutcome(reels) {
   
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
        return { win: true, message: `Congratulations! You won with ${reels.join(', ')}!` };
    } else {
        return { win: false, message: `Sorry, you lost. Better luck next time!` };
    }
}

module.exports = { spinReels, determineOutcome };


