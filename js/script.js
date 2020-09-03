$(document).ready(function(){

  $("#bottone-ricerca").click(function(){ // Al click del bottone..

    var ricerca = $("#ricerca").val(); // Salvo in una variabile il valore nel campo input.
    reset();
    insertFilm(ricerca);

  });

});

// **FUNZIONI**

//Funzione per resettare il campo.
function reset(){
  $(".stampa").empty();
  $("#ricerca").val("");
}


//Funzione per la ricerca del film.
function insertFilm(data){
  $.ajax( //Chiamata AJAX
    {
      url: "https://api.themoviedb.org/3/search/movie", // URL API
      method: "GET",
      data:{
      api_key:"45dccc48871c1e02af14477d08b6af41", // APIkey.
      query: data, // Passo la variabile in cui ho salvato il valore del campo input.
      language:"it-IT"
      },
      success: function(risposta){
        if (risposta.total_results > 0){
          printFilm(risposta)
        } else {
          noResult()
        }

      },
      error: function(){
        alert("È avvenuto un errore; Inserisci un valore");
     }
    }
  );
}


//Funzione per la stampa del Film.
function printFilm(data){
  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);
  for (var i = 0; i < data.results.length; i++){ // Ciclo for per attraversare "results"
    var film = { // Oggetto che rappresenterà poi il mio context per Handlebars.
      title: data.results[i].title,
      original_title: data.results[i].original_title,
      language: data.results[i].original_language,
      vote_average: data.results[i].vote_average
    };
    var html = template(film);
    $(".stampa").append(html);
  }
}


// Funzione per la ricerca "fallita".
function noResult() {
  var source = $("#no-result-template").html();
  var template = Handlebars.compile(source);
  var context = {
    noResult: "Non ci sono risultati"
  };
  var html = template(context);
  $(".stampa").append(html);
}


//-----------------------------------------------------------------------------------------------------------------------------------------

// Vecchia soluzione senza funzioni

// $(document).ready(function(){
//
//   $("#bottone-ricerca").click(function(){ // Al click del bottone..
//
//     var ricerca = $("#ricerca").val(); // Salvo in una variabile il valore nel campo input.
//     $("#ricerca").val(" "); // Pulisco il campo di ricerca
//
//     $(".locandina").remove(); // Rimuovo quanto appeso da HB, altrimenti resterebbero appesi i risultati di ogni ricerca.
//
//     $.ajax( //Chiamata AJAX
//       {
//         url: "https://api.themoviedb.org/3/search/movie", // URL API
//         method: "GET",
//         data:{
//         api_key:"45dccc48871c1e02af14477d08b6af41", // APIkey.
//         query: ricerca, // Passo la variabile in cui ho salvato il valore del campo input.
//         language:"it-IT"
//         },
//         success: function(risposta){
//           for (var i = 0; i < risposta.results.length; i++){ // Ciclo for per attraversare "results"
//             var film = { // Oggetto che rappresenterà poi il mio context per Handlebars.
//               title: risposta.results[i].title,
//               original_title: risposta.results[i].original_title,
//               language: risposta.results[i].original_language,
//               vote_average: risposta.results[i].vote_average
//             };
//             var source = $("#entry-template").html();
//             var template = Handlebars.compile(source);
//             var html = template(film);
//             $(".stampa").append(html);
//           }
//         },
//         error: function(){
//           alert("È avvenuto un errore; Inserisci un valore");
//        }
//       }
//     );
//   });
//
// });
