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
  var pastSearches = JSON.parse(localStorage.getItem('pastSearches')) || [];

  function movieSearch() {
    var movieTitle = input.val().trim();
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if(data.Response === 'False') {
            result.text('No results found!');
            title.text('');
            genre.text('');
            year.text('');
            rating.text('');
            plot.text('');
            imagePoster.attr('scr','..' );           
            return;
          
        }
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
        }
        console.log(data);
        result.text('')
        title.text(`Title: ${data.Title}`);
        genre.text(`Genre: ${data.Genre}`);
        year.text(`Year Released: ${data.Year}`);
        rating.text(`Rated: ${data.Rated}`);
        plot.text(`Plot: ${data.Plot}`);
        imagePoster.attr('src', data.Poster);
      })
   
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
}

  form.on('submit', function(event) {
    event.preventDefault();
    movieSearch();
  })
})
