function submitEmailForm (event) {
  $.post('/mailing-list/join', $(event.target).serialize(), function(data) {
      $("#signup-result").html(data);
      alertify.log(data, "default");
      fbq('track', 'Lead');
    },
    'json'
  );
  event.preventDefault();
}

$("#mailing-list").submit(submitEmailForm);
$("#mailing-list-footer").submit(submitEmailForm);

function presaleFormSubmit(event) {
  $.post('/presale/join', $('form').serialize(), function(data) {
    if (data == "OK") {
      fbq('track', 'Lead');
      window.location = "/";
    }
    alertify.log(data, "default");
  },
  'json')
}

function partnerFormSubmit(event) {
  $.post('/partners/interest', $('form').serialize(), function(data) {

    if (data == "OK") {
      fbq('track', 'Lead');
      window.location = "/";
    }
    alertify.log(data, "default");
  },
  'json');
}


$(function() {
  $(".dropdown-menu a").click(function() {
    $("input[name='desired_allocation_currency']").val($(this).text());
    $("#desired_allocation_currency").text($(this).text());
    $("#desired_allocation_currency").val($(this).text());
  });
});

// mobile navbar
$(function(){
  // toggle button icons
  $('.navbar-toggler').on('click', function() {
    var target = $(this);
    var other = $('.navbar-toggler').not(this);

    // attr value is a string, not bool
    if (target.attr('aria-expanded') === 'false') {
      target.find('.close-icon').show();
      target.find(':not(.close-icon)').hide();
    } else {
      target.find('.close-icon').hide();
      target.find(':not(.close-icon)').show();
    }

    if (other.attr('aria-expanded') === 'true') {
      other.find('.close-icon').hide();
      other.find(':not(.close-icon)').show();
    }
  });

  // prevent simulataneous navbar menus
  $('.navbar-origin .navbar-collapse').on('show.bs.collapse', function() {
    // ensure that menu is not hidden
    $(this).removeClass('obscured');
    // hide immediately to disguise 'hide' transition
    $('.navbar-origin .navbar-collapse').not(this).addClass('obscured');
    // will trigger transition
    $('.navbar-origin .navbar-collapse').not(this).collapse('hide');
  });

  // ensure that hidden menus can be shown
  $('.navbar-origin .navbar-collapse').on('hidden.bs.collapse', function() {
    $('.navbar-origin .navbar-collapse').not('.show').removeClass('obscured');
  });
});

// partners logos
$(function() {
  $('.collapse.logos').on('hidden.bs.collapse', function() {
    $('.more').addClass('d-block').removeClass('d-none');
    $('.less').addClass('d-none').removeClass('d-block');
  });

  $('.collapse.logos').on('shown.bs.collapse', function() {
    $('.more').addClass('d-none').removeClass('d-block');
    $('.less').addClass('d-block').removeClass('d-none');
  });
});

// show html content in tooltip
$('[data-toggle="tooltip"]').tooltip({
  html: true
});

// REDESIGN 2019 START
$(function() {
  function handleVideoResize(backgroundVideoElementId, videoAspectRatio, isVideoPlayer, bgPlayer) {
    var videoElement = document.getElementById(backgroundVideoElementId)
    var containerWidth = videoElement.parentElement.offsetWidth;
    var containerHeight = videoElement.parentElement.offsetHeight;

    if (containerHeight / videoAspectRatio > containerWidth) {
      var width = containerHeight/videoAspectRatio;
      if (isVideoPlayer){
        bgPlayer.setSize(width, containerHeight);
      } else {
        videoElement.style.width = width + "px";
        videoElement.style.height = containerHeight + "px";
      }
    } else {
      var height = containerWidth*videoAspectRatio;
      if (isVideoPlayer) {
        bgPlayer.setSize(containerWidth, height);
      } else {
        videoElement.style.width = containerWidth + "px";
        videoElement.style.height = height + "px";
      }
    }
  }

  function setupYoutubeVideoElement(backgroundElementId, videoSource, aspectRatio, videoButtonId, fullScreenVideoElementId, bgElementIsVideo) {
    var playerOpts = {
      autoplay: true,
      controls: false,
      fullscreen: false,
      related: false,
      info: false,
      related: false,
      width: '100%',
      height: '100%'
    };

    var fullScreenPlayerOpts = {};

    Object.assign(fullScreenPlayerOpts, playerOpts, {
      fullscreen: true,
      controls: true,
      playsInline: false
    });

    var backgroundElement = document.getElementById(backgroundElementId);
    if (!backgroundElement) {
      console.warn('Can not find element with id: ', backgroundElementId);
      return;
    }

    if (bgElementIsVideo) {
      var bgPlayer = new window.ytPlayer('#' + backgroundElementId, playerOpts);
      bgPlayer.load(videoSource);
      bgPlayer.setVolume(0);
      bgPlayer.on('ended', () => {
        // loop
        bgPlayer.seek(0);
        bgPlayer.play();
      });
      bgPlayer.play();
    }
      
    // video source is stored in data-video-source property
    if (!bgElementIsVideo) {
      videoSource = $('#video-page-video').attr("data-video-source");
    }

    var fullPlayer = new window.ytPlayer('#' + fullScreenVideoElementId, fullScreenPlayerOpts);
    fullPlayer.load(videoSource);

    fullPlayer.on('unstarted', function () {
      var socialLinks = document.querySelectorAll('[share-video-to]')
  
      for (var i = 0; i < socialLinks.length; i++) {
        var link = socialLinks[i]
        var href = document.getElementById(fullScreenVideoElementId).getAttribute('src')
        var title = document.querySelector('.segment-title')
        switch (link.getAttribute('share-video-to')) {
          case 'facebook':
            href = 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(href)
            break
          case 'twitter':
            title = encodeURIComponent(title ? title.innerText + ' ' : '')
            href = 'https://twitter.com/intent/tweet?text=' + title + encodeURIComponent(href)
            break
        }

        link.setAttribute('href', href)
      }
    })

    function closeFullScreen() {
      fullPlayer.stop();
      var el = document.getElementById(fullScreenVideoElementId)
      el.classList.add('d-none')
      el.onfullscreenchange = undefined
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozExitFullScreen) {
        document.mozExitFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }  

    function goFullscreen() {
      var el = document.getElementById(fullScreenVideoElementId)

      var promise
      if (el.requestFullscreen) {
        promise = el.requestFullscreen()
      } else if (el.mozRequestFullScreen) {
        promise = el.mozRequestFullScreen()
      } else if (el.webkitRequestFullscreen) {
        promise = el.webkitRequestFullscreen()
      } else if (el.msRequestFullscreen) {
        promise = el.msRequestFullscreen()
      }

      if (!promise) {
        return
      }
      var flag = false
      promise
        .then(function () {
          el.onfullscreenchange = function () {
            if (!flag) {
              // Hack to ignore the first fullscreen change event
              // We cannot differentiate fullscreen enter/exit otherwise
              flag = true
              return
            }
            closeFullScreen()
          }
        })
    }

    $(document).keyup(function(e) {
      if (e.key === "Escape") {
        closeFullScreen()
      }
    });

    // close the video when it ends
    fullPlayer.on('ended', () => {
      closeFullScreen()
    });

    function callHandleVideoResize() {
      handleVideoResize(backgroundElementId, aspectRatio, bgElementIsVideo, bgPlayer);
    }

    window.onresize = callHandleVideoResize;
    callHandleVideoResize();

    $('#' + videoButtonId).click(function() {
      var el = document.getElementById(fullScreenVideoElementId)
      el.classList.remove('d-none')
      if (bgElementIsVideo) {
        bgPlayer.seek(0);
      }

      goFullscreen()
      fullPlayer.play();
    });
  }

  setupYoutubeVideoElement('landing-video-background', 'aanKtnkWP8U', 0.42, 'index-video-button', 'landing-video', true)
  setupYoutubeVideoElement('about-video-background', 'e70bvBw1oOo', 0.56, 'about-video-button', 'about-video', true)
  setupYoutubeVideoElement('team-video-background', 'ERh2n-vlpQ4', 0.56, 'team-video-button', 'team-video', true)
  setupYoutubeVideoElement('investors-video-background', 'tAyusRT3ZDQ', 0.56, 'investors-video-button', 'investors-video', true)
  setupYoutubeVideoElement('video-page-video-background', null, 0.56, 'video-page-video-button', 'video-page-video', false)
});

$(function() {
  var socialSection = document.getElementById('social-media-list')
  if (!socialSection)
    return

  var socialLegend = {
    'Discord': {
      'img': '/static/img/about/discord.svg',
      'countLabel': 'members'
    },
    'Telegram': {
      'img': '/static/img/about/telegram.svg',
      'countLabel': 'members'
    },
    'Wechat': {
      'img': '/static/img/about/wechat.svg',
      'countLabel': 'followers'
    },
    'KaKao plus friends': {
      'img': '/static/img/about/kakao.svg',
      'countLabel': 'subscribers'
    },
    'Facebook': {
      'img': '/static/img/about/facebook.svg',
      'countLabel': 'followers'
    },
    'Twitter': {
      'img': '/static/img/about/twitter.svg',
      'countLabel': 'followers'
    },
    'Instagram': {
      'img': '/static/img/about/instagram.svg',
      'countLabel': 'followers'
    },
    'Youtube': {
      'img': '/static/img/about/youtube.svg',
      'countLabel': 'subscribers'
    },
    'Reddit': {
      'img': '/static/img/about/reddit.svg',
      'countLabel': 'subscribers'
    }
  }

  function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild; 
  }

  function intlFormat(num)
  {
    return new Intl.NumberFormat().format(Math.round(num*10)/10);
  }

  function formatNumber(num)
  {
    if(num >= 1000000)
      return intlFormat(num/1000000)+'M';
    if(num >= 1000)
      return intlFormat(num/1000)+'k';
    return intlFormat(num);
  }


  $.ajax({
    url: '/social-stats'
  })
    .done(function( data ) {
      if (!data || !data.stats)
        return

      data.stats.forEach(stat => {
        var statMetadata = socialLegend[stat.name]
        if(!statMetadata)
          return

        socialSection.appendChild(createElementFromHTML(
          '<div class="d-flex flex-column social-box">' +
            '<img src="' + statMetadata.img + '"/>' +
            '<div class="mt-auto">' + formatNumber(stat.subscribed_count) + ' ' + statMetadata.countLabel  + '</div>' +
          '</div>'
        ))
      })
    })
});

// To set defualt language
(function() {
  var langRegExp = /^\/[a-z]{2,3}(_[a-z]{4})?(\/|$)/i
  if(!langRegExp.test(window.location.pathname)) {
    var currentLang = document.body.parentElement.getAttribute('lang')
    window.location = '/' + currentLang + window.location.pathname
  }
})()
