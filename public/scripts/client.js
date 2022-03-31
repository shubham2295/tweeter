/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//---------Helper functions----------------------------------

//---------User input filtering to stop prevent XSS-----------
const filterInput = function(str) {
  let p = document.createElement('p');
  $(p).addClass('tweet-content');
  p.appendChild(document.createTextNode(str));
  return p.outerHTML;
};

//---------Create tweet article using json object-----------
const createTweetElement = function(tweet) {

  let $tweet = $(`<article>
<header class="flex-spacebetween tweet">
  <div class="flex-spacebetween">
    <img src=${tweet.user.avatars} />
    <p class="username">${tweet.user.name}</p>
  </div>
  <p class="userid">${tweet.user.handle}</p>
</header>
${filterInput(tweet.content.text)}
<hr />
<footer class="flex-spacebetween tweet-details">
  <p>${timeago.format(tweet.created_at)}</p>
  <div class="icons">
    <i class="fa-solid fa-flag"></i>
    <i class="fa-solid fa-retweet"></i>
    <i class="fa-solid fa-heart"></i>
  </div>
</footer>
</article>`);

  return $tweet;
};

//---------Iterating through array of tweets and attaching them to DOM-----------
const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('.tweets').prepend($tweet);
  }
};

//---------Running script when DOM is ready for manipulation------------
$(function() {


  const $form = $('#tweet-form');
  const $formContent = $('#tweet-text');
  const $error = $('#error');
  const $navBtn = $('.btn-nav');
  const $newTweet = $('.new-tweet');
  const $bottomBtn = $('.btn-bottom');

  $form.submit(function(event) {

    event.preventDefault();
    $error.hide();

    //------Checking for valid form input--------------
    const content = $formContent.val();
    if (content.length > 140) {
      $error.text('Tweet size can not exceed 140 charachter limit.');
      $error.fadeIn(250);
      $formContent.focus();
      return;
    } else if (!content || !content.replace(/\s/g, '').length) {
      $error.text('Tweet content can not be empty.');
      $error.fadeIn(250);
      $formContent.focus();
      return;
    }

    //------AJAX Post request to subbmit new tweet using form--------------
    $.ajax({
      type: "POST",
      url: '/tweets',
      data: $form.serialize()
    }).then(function() {
      $formContent.val('');
      $('.counter').text('140');
      loadTweet();
      $formContent.focus();
    });
  });

  //-------AJAX Get request to get and render new tweets on the page------
  const loadTweet = function() {
    $.ajax('/tweets', { type: "GET" })
      .then(function(tweetsArray) {
        $('.tweets').empty();
        renderTweets(tweetsArray);
      });
  };

  //-------Initial loading of tweets on first visit--------
  loadTweet();

  //------Show/Hide button for new tweet area--------------
  $navBtn.on('click', function() {
    $newTweet.slideToggle('slow', function() {
      $formContent.focus();
    });
  });

  //------Scroll to top button------------------------------
  $(window).scroll(function() {
    const scrollPos = $(document).scrollTop();
    if (scrollPos > 100) {
      $bottomBtn.show();
    } else {
      $bottomBtn.hide();
    }

  });

  $bottomBtn.on('click', function() {
    $(window).scrollTop(0);
  });

});

