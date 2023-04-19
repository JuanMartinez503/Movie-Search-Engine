$(document).ready(function() {
  var apiKey= 'dd2719c9'
  var form = $('#form');
  var input = $('#input');
  var title = $('#title');
  var genre = $('#genre');
  var year = $('#year');  
  var rating = $('#rating');
  var plot = $('#plot');
  var result = $('#result');
  var imagePoster =$('#img')
  var apiKey2 = 'd2d236a60e31f84f94b8f09b4f4d0a56'
  var suggestionsList = $('#suggestion-list')

  var pastSearches = JSON.parse(localStorage.getItem('pastSearches')) || [];
                 // Function for Movie Search OMDB 
  function movieSearch() {
    var movieTitle = input.val().trim();
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}`)
      .then(function(response) {
        return response.json();
      })              // Fetch API 
      .then(function(data) {
        if(data.Response === 'False') {
            result.text('No results found!');
            title.text('');
            genre.text('');
            year.text('');
            rating.text('');
            plot.text('');
            imagePoster.attr('src','')
            imagePoster.removeClass('posterimage')
            $('#info').removeClass('infoborder')
            
            $('#streaminfo').removeClass('streaminfo', 'mx-3')
            $('#stream').empty()
            $('#places').empty()
            return;
                 
        }         //Past Searches
        if (!pastSearches.includes(movieTitle)) {
          pastSearches.push(movieTitle);
          localStorage.setItem('pastSearches', JSON.stringify(pastSearches));
          var li = $('<li>').text(movieTitle);
          li.addClass('dropdown-item')
          $('#list').append(li);
          li.on('click', function(e){
            console.log('hi');
            input.val($(e.target).text())
            movieSearch()
          })
        }            // Borders and Data 
        $('#info').addClass('infoborder')
        imagePoster.addClass('posterimage')
        $('#streaminfo').addClass('streaminfo', 'mx-3')
        console.log(data);
        result.text('')
        title.text(`Title: ${data.Title}`);
        genre.text(`Genre: ${data.Genre}`);
        year.text(`Year Released: ${data.Year}`);
        rating.text(`Rated: ${data.Rated}`);
        plot.text(`Plot: ${data.Plot}`);
        imagePoster.attr('src', data.Poster);
      })

      streamSearch()
   
  }
for (var i = 0;i < pastSearches.length; i++){
  var li = $('<li>').text(pastSearches[i]);
  li.addClass('dropdown-item')
  $('#list').append(li);
  li.on('click', function(e){
    console.log('hello');
    input.val($(e.target).text())
    movieSearch()
  })
}                               //Fetch Wiki API 
function streamSearch (){
  var providerSearch = input.val().trim();

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey2}&query=${providerSearch}`)
  .then(response => response.json())
  .then(data => {
    
    if (data.results.id ===undefined){
      $('#places').text('No available places to stream!')
      return
    }
    const movieId = data.results[0].id; // get the ID of the first movie in the results array
        
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?locale=US&api_key=${apiKey2}`)
      .then(response => response.json())
      .then(data => {
    
        
        console.log(data);
        const watchProviders = data.results.US.flatrate; // get the list of watch providers for the US region
        console.log(watchProviders); // log the list of watch providers to the console
        $('#stream').empty()
        $('#places').text('Places to stream!')

        for (var i =0; i<watchProviders.length;i++){
          // var img = $('<img>')
          // img.attr('src',`https://www.themoviedb.org/movie/${movieId}/watch?locale=US/${watchProviders[i].logo_path }`)
          // $('#wiki').append(img)
          var h3 = $('<h3>')
          
          h3.text(watchProviders[i].provider_name)

          $('#stream').append(h3)
        }
      })
  })

}
function hideSuggestions(){
  suggestionsList.empty()
}

  form.on('submit', function(event) {
    event.preventDefault();
    movieSearch();
  })
  input.on('keyup', function(event) {
    var query = $(this).val().trim();
    if (query.length > 0) {
      fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          if (data.Response === 'True') {
            var suggestions = data.Search.map(function(movie) {
              return movie.Title;
            });
            showSuggestions(suggestions);
          } else {
            hideSuggestions();
          }
        });
    } else {
      hideSuggestions();
    }
  });
  
  function showSuggestions(suggestions) {
    
    // Remove any previous suggestions
    suggestionsList.empty();
    // Add a list item for each suggestion
    for (var i = 0; i < suggestions.length; i++) {
      var suggestion = suggestions[i];
      var listItem = $('<li>').text(suggestion);
      listItem.addClass(' px-2 text-dark')
      suggestionsList.append(listItem);
      listItem.on('click', function(e){
        input.val($(this).text());
        movieSearch();
      })
    }
    // Show the suggestions
    suggestionsList.show();
  }

})
