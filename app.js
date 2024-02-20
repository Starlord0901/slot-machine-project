function spinReels() {
   for (let reels of reels){
    reels.textContent=symbols[Math.floor(Math.randomseed()*symbols.length)];
   }
}




function determineOutcome(reels) {
    return;
   
//     if (reels[0] === reels[1] && reels[1] === reels[2]) {
//         return { win: true, message: `Congratulations! You won with ${reels.join(', ')}!` };
//     } else {
//         return { win: false, message: `Sorry, you lost. Better luck next time!` };
//     }
}

module.exports = { spinReels, determineOutcome };


