// MILESTONE 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
//     Titolo
//     Titolo Originale
//     Lingua
//     Voto

// MILESTONE 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

// MILESTONE 3:
// In questa milestone come prima cosa aggiungiamo la copertina del film o della serie
// al nostro elenco. Ci viene passata dall’API solo la parte finale dell’URL, questo
// perché poi potremo generare da quella porzione di URL tante dimensioni diverse.
// Dovremo prendere quindi l’URL base delle immagini di TMDB:
// https://image.tmdb.org/t/p/
// per poi aggiungere la dimensione che vogliamo generare
// (troviamo tutte le dimensioni possibili a questo link:
// https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400
// ) per poi aggiungere la
// parte finale dell’URL passata dall’API.
// Esempio di URL che torna la copertina di BORIS:
// https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg

$(document).ready(function(){

  $("#bottone-ricerca").click(function(){ // Al click del bottone..

    var ricerca = $("#ricerca").val(); // Salvo in una variabile il valore nel campo input.
    reset();
    insertFilm(ricerca);
    insertSerie(ricerca);

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
          printFilm(risposta) // Richiamo un'altra funzione
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


//Funzione per la ricerca della serie.
function insertSerie(data){
  $.ajax( //Chiamata AJAX
    {
      url: "https://api.themoviedb.org/3/search/tv", // URL API
      method: "GET",
      data:{
      api_key:"45dccc48871c1e02af14477d08b6af41", // APIkey.
      query: data, // Passo la variabile in cui ho salvato il valore del campo input.
      language:"it-IT"
      },
      success: function(risposta){
        if (risposta.total_results > 0){
          printSerie(risposta) // Richiamo un'altra funzione
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
      language: flag(data.results[i].original_language),
      vote_average: stars(data.results[i].vote_average), // Richiamata funzione per voto/stella
      poster_path: data.results[i].poster_path  // Aggiunta chiave per visualizzazione copertina.
    };
    var html = template(film);
    $(".stampa").append(html);
  }
}

//Funzione per la stampa della serie.
function printSerie(data){
  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);
  for (var i = 0; i < data.results.length; i++){ // Ciclo for per attraversare "results"
    var serie = { // Oggetto che rappresenterà poi il mio context per Handlebars.
      title: data.results[i].name,
      original_title: data.results[i].original_name,
      language: flag(data.results[i].original_language),
      vote_average: stars(data.results[i].vote_average), // Richiamata funzione per voto/stella
      poster_path: data.results[i].poster_path
    };
    var html = template(serie);
    $(".stampa").append(html);
    console.log(data.results.length);
  }
}


// Funzione per la ricerca "fallita".
function noResult(){
  var source = $("#no-result-template").html();
  var template = Handlebars.compile(source);
  var context = {
    noResult: "Non ci sono risultati"
  };
  var html = template(context);
  $(".stampa").append(html);
}

function stars(voto){
  var voto = Math.ceil(voto/2); // divido per due ed arrotondo per eccesso. //potrei non riscrivere var, è già nell'argomento.
  var somma = ""; // Inizzializzo una var somma con stringa vuota;

  for (var i = 1; i <= 5; i++){ // Ciclo for per far stampare le stelle (dovranno essere sempre 5).
    if (i <= voto){ // se la i è minore o uguale al voto
      var stella = '<i class="fas fa-star"></i>'; // la var stella avrà icona stella piena
    } else { // altrimenti la var stella avrà icona stella vuota
      var stella = '<i class="far fa-star"></i>';
    }
    somma += stella; // Ad ogni ciclo sommo la var stella
  }
  return somma; // return della funzione
}


// Funzione bandiere
function flag(lingua){
  var language = ['en','it']; // Creo un array contentente le lingue che voglio gestire.
  if (language.includes(lingua)){ // Se l'array language include l'argomento...
    return '<img src="img/' + lingua +'.png" class="flag">'; // posso farlo perchè ho una cartella con i file già rinominati a mio piacimento.
  }
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
