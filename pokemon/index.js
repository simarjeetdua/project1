fetchData();


async function fetchData(){
    try{

let pokeName = document.getElementById("search").value.toLowerCase();

document.querySelector("button").innerText ="fetch pokemon";


  if (!pokeName) {
            alert("Please enter a Pokémon name");
            return;
        }


        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
        if(!response.ok){
            throw new Error("response not working / not ok");
         }
         let data = await response.json();
        
         let pokeImage = data.sprites.front_default;
         let pokeImgElement = document.getElementById("poke-img");
         pokeImgElement.src = pokeImage;
         pokeImgElement.style.display="block";

    }
    catch(error)
    {
        console.error(error);
        alert("pokemon not found ");
    }
}
// fetchData();