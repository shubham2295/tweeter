/* eslint-disable no-undef */
$(document).ready(function() {

  $('#tweet-text').on('keyup', function() {
    const inputLength = 140 - $(this).val().length;
    const counter = $(this).parent().find('.counter').text(inputLength);
    if (inputLength < 0) {
      counter.addClass('red-text');
    } else {
      counter.removeClass('red-text');
    }

  });

});

