// filepath: /d:/Programming/WorkShop/Clone Projects/Spotify/script.js
// Listing Songs
let currentSong = new Audio();
let isRepeat = false;
let songs;
let currFolder;
// Fuction 1
async function getSongs(folder) 
{
    currFolder = folder.replace(/^\.\//, '') ;
    try {  
        let a = await fetch(`http://127.0.0.1:5500/WorkShop/Clone%20Projects/Spotify/${folder}`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
         songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
     // Ensure the URL is properly encoded      
                songs.push(element.href.split(`/${currFolder}/`)[1]);
            }
        }
    
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }

 // Show all Playlist Songs 
 let songUL = document.querySelector(".scroll_bar").getElementsByTagName("ul")[0]
 songUL.innerHTML =  " "; 
 for (const song of songs) {
     songUL.innerHTML = songUL.innerHTML + 
                    `<li><img class="invert" width="34" src="./Assists/music.svg" alt="">
                         <div class="info">
                             <div> ${song.replaceAll("%20", " ")}</div>
                             <div>Harry</div>
                         </div>
                         <div class="playnow">
                             <span>Play Now</span>
                             <img class="invert" src="./Assists/play-botton.svg" alt="">
                         </div> </li>`;
 }

 var audio = new Audio(`/${currFolder}/` + songs[0]);
 audio.play();
 
 audio.addEventListener('loadeddata', () => {
     let duration = audio.duration; // Corrected variable name
 });


// Attach an event listener to each song 
Array.from( document.querySelector(".scroll_bar").getElementsByTagName("li")).forEach( e => {
     e.addEventListener("click", element => {
     playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())   
     
 })
 }) 
 return songs;
}

// Function 2
// Play Music Function 
const playMusic = (track, pause = false) => {
    //let audio = new Audio("/songs/"+ track)
   currentSong.src = `${currFolder}/${track}`;
   if(!pause){
       currentSong.play()
       play.src = "./Assists/pause.svg"
   }
    document.querySelector(".songs-name1").innerHTML = decodeURI(track); // <= decodeURI remove %20
    document.querySelector(".duration").innerHTML = "00:00";
    document.querySelector(".artist").innerHTML = "Artist Tushar";

}

// Function 3

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}





// Function 4
// Display All the Albums on the page 
async function displayAlbum() {
    let a = await fetch(`http://127.0.0.1:5500/WorkShop/Clone%20Projects/Spotify/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cards = document.querySelector(".cards")
    Array.from(anchors).forEach(async e=>{
        
        
        console.log(e.href);
        if(e.href.includes("/songs")){
        let folder = e.href.split("/").slice([-1])[0];
           // Get the metadata of the folder
    let a = await fetch(`http://127.0.0.1:5500/WorkShop/Clone%20Projects/Spotify/songs/${folder}/info.json`);
    let response = await a.json();
    console.log(response);
    cards.innerHTML = cards.innerHTML + `
      <div data-folder="ncs" class="card">
            <img src="http://127.0.0.1:5500/WorkShop/Clone%20Projects/Spotify/songs/${folder}/cover.jpg" alt="" />
            <div  class="play"><img src="./Assists/Play.svg" alt="" /></div>

            <p>${response.title}</p>
          </div>
    
      <div data-folder="bhajan" class="card">
            <img src="http://127.0.0.1:5500/WorkShop/Clone%20Projects/Spotify/songs/${folder}/cover.jpg" alt="" />
            <div  class="play"><img src="./Assists/Play.svg" alt="" /></div>

            <p>${response.title}</p>
          </div>
    
     
    `

    // load playlist whenever card clicked 
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        
    })
})
 }
    })        
}



// Function 5
async function main() {
    // Listing songs in playlist
     songs = await getSongs("./songs/ncs")
    playMusic(songs[0], true)

   

// Attach an event linstener to play, next and previous buttons
play.addEventListener("click", () => {
if(currentSong.paused){
    currentSong.play()
    play.src = "./Assists/pause.svg"
}
else{
    currentSong.pause()
    play.src = "./Assists/playbar/play.svg"
}
})



// Duration of song
// Listen for timeupdate Event 
 currentSong.addEventListener("timeupdate", ()=>{
    document.querySelector(".duration").innerHTML = `${secondsToMinutesSeconds(currentSong.
    currentTime)}/${(secondsToMinutesSeconds(currentSong.duration))}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration
    ) * 100 + "%";
})


    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    
    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left-side").style.left = "0"
    } )
    
    // Add an event listener to Close tab 
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left-side").style.left = '-500px'
    })
    // Add an event listener for hamburger Nav
    document.querySelector(".hamburger1").addEventListener("click", ()=>{
        document.querySelector(".premium-parent1").style.right = "0"
        
    })
    
    // Add an Event Listener TO Previous and Nect 
    previous.addEventListener("click", ()=>{
    currentSong.pause()
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1)>=0){
        playMusic(songs[index -1])
    }
    
})

// Add an Event Listener TO Previous and Nect 
next.addEventListener("click", ()=>{
    let filename = currentSong.src.split("/").pop();
    let index = songs.indexOf(filename);
    if ((index + 1) < songs.length) {
        playMusic(songs[index+1]);
    }
})

//Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100
    if (currentSong.volume >0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("./Assists/playbar/mute.svg", "./Assists/playbar/Volume.svg")
    }
})

// Repeat button functionality
document.querySelector('.vector-icon2').addEventListener('click', () => {
    isRepeat = !isRepeat;
    document.querySelector('.vector-icon2').classList.toggle('active', isRepeat);
});

displayAlbum() ;
}


main(); // call main function 
