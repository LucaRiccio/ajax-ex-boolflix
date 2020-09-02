$(document).ready(function(){

  $("#bottone-ricerca").click(function(){ // Al click del bottone..
    var ricerca = $("#ricerca").val(); // Salvo in una variabile il valore nel campo input.
    //console.log(ricerca);

    $.ajax( //Chiamata AJAX
      {
        url: "https://api.themoviedb.org/3/search/movie", // URL API
        method: "GET",
        data:{
        api_key:"45dccc48871c1e02af14477d08b6af41", // APIkey.
        query: ricerca, // Passo la variabile in cui ho salvato il valore del campo input.
        language:"it-IT"
        },
        success: function(risposta){
          //console.log(risposta.results);
          for (var i = 0; i < risposta.results.length; i++){
            console.log(risposta.results[i]);
            var film = { // Oggetto che rappresenterà poi il mio context per Handlebars
              title: risposta.results[i].title,
              original_title: risposta.results[i].original_title,
              language: risposta.results[i].language,
              vote_average: risposta.results[i].vote_average
            };
          }
        },
        error: function(){
          alert("È avvenuto un errore.");
       }
      }
    );

  });



  // var source = document.getElementById("entry-template").innerHTML;
  // var template = Handlebars.compile(source);
  //
  //
  //
  // var context = { title: "My New Post", body: "This is my first post!" };
  // var html = template(context);
























});
