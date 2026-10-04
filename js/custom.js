/******************************************
    Version: 1.0
/****************************************** */

(function($) {
    "use strict";

	
	var isScrollingManual = false;

	function setActiveNav(targetHash) {
		$('#mainNav .nav-link').removeClass('active');
		$('#mainNav .nav-item').removeClass('active');
		var $link = $('#mainNav .nav-link[href="' + targetHash + '"]');
		if ($link.length) {
			$link.addClass('active');
			$link.closest('.nav-item').addClass('active');
		}
	}

	function updateActiveNav() {
		if (isScrollingManual) return;

		var scrollTop = $(window).scrollTop();
		var windowHeight = $(window).height();
		var docHeight = $(document).height();

		// Bottom of page -> force active to #contact
		if (scrollTop + windowHeight >= docHeight - 40) {
			setActiveNav('#contact');
			return;
		}

		// Top of page -> force active to #home
		if (scrollTop < 120) {
			setActiveNav('#home');
			return;
		}

		var sections = ['#home', '#about', '#experience', '#services', '#portfolio', '#contact'];
		var currentSection = '#home';
		var scrollCheck = scrollTop + 120; // offset for fixed navbar

		for (var i = 0; i < sections.length; i++) {
			var $sec = $(sections[i]);
			if ($sec.length) {
				var secTop = $sec.offset().top;
				if (scrollCheck >= secTop - 30) {
					currentSection = sections[i];
				}
			}
		}

		setActiveNav(currentSection);
	}

	$(window).on('scroll resize load', updateActiveNav);

	// Smooth scrolling on navbar link click
	$('a.js-scroll-trigger[href*="#"]:not([href="#"])').off('click').on('click', function(e) {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				e.preventDefault();
				var targetHash = this.hash;
				var targetOffset = targetHash === '#home' ? 0 : Math.max(0, target.offset().top - 80);
				
				isScrollingManual = true;
				setActiveNav(targetHash);
				$('.navbar-collapse').collapse('hide');

				$('html, body').stop().animate({
					scrollTop: targetOffset
				}, 500, 'swing', function() {
					isScrollingManual = false;
					updateActiveNav();
				});
				return false;
			}
		}
	});

	// Collapse Navbar
	  var navbarCollapse = function() {
		if ($("#mainNav").offset().top > 100) {
		  $("#mainNav").addClass("navbar-shrink");
		} else {
		  $("#mainNav").removeClass("navbar-shrink");
		}
	  };
	// Collapse now if page is not at top
	  navbarCollapse();
	  // Collapse the navbar when page is scrolled
	  $(window).scroll(navbarCollapse);

	// Hide navbar when modals trigger
	  $('.portfolio-modal').on('show.bs.modal', function(e) {
		$(".navbar").addClass("d-none");
	  })
	  $('.portfolio-modal').on('hidden.bs.modal', function(e) {
		$(".navbar").removeClass("d-none");
	  })

    // Scroll to top  		
	if ($('#scroll-to-top').length) {
		var scrollTrigger = 100, // px
			backToTop = function () {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > scrollTrigger) {
					$('#scroll-to-top').addClass('show');
				} else {
					$('#scroll-to-top').removeClass('show');
				}
			};
		backToTop();
		$(window).on('scroll', function () {
			backToTop();
		});
		$('#scroll-to-top').on('click', function (e) {
			e.preventDefault();
			$('html,body').animate({
				scrollTop: 0
			}, 700);
		});
	}
	
	// Banner 
	
    $('.heading').height( $(window).height() );
	$('.parallaxie').parallaxie();
	
    // Gallery Filter
        var Container = $('.container');
        Container.imagesLoaded(function () {
            var portfolio = $('.gallery-menu');
            portfolio.on('click', 'button', function () {
                $(this).addClass('active').siblings().removeClass('active');
                var filterValue = $(this).attr('data-filter');
                $grid.isotope({
                    filter: filterValue
                });
            });
            var $grid = $('.gallery-list').isotope({
                itemSelector: '.gallery-grid',
                layoutMode: 'fitRows'
            });

        });
	
    // FUN FACTS   

    function count($this) {
        var current = parseInt($this.html(), 10);
        current = current + 50; /* Where 50 is increment */
        $this.html(++current);
        if (current > $this.data('count')) {
            $this.html($this.data('count'));
        } else {
            setTimeout(function() {
                count($this)
            }, 30);
        }
    }
    $(".stat_count, .stat_count_download").each(function() {
        $(this).data('count', parseInt($(this).html(), 10));
        $(this).html('0');
        count($(this));
    });

    // CONTACT
    jQuery(document).ready(function() {
        $('#submit-form').submit(function() {
            var action = $(this).attr('action');
            $("#message").slideUp(750, function() {
                $('#message').hide();
                $('#submit')
                    .after('<img src="images/ajax-loader.gif" class="loader" />')
                    .attr('disabled', 'disabled');
                $.post(action, {
                        first_name: $('#first_name').val(),
                        last_name: $('#last_name').val(),
                        email: $('#email').val(),
                        phone: $('#phone').val(),
                        select_service: $('#select_service').val(),
                        select_price: $('#select_price').val(),
                        comments: $('#comments').val(),
                        verify: $('#verify').val()
                    },
                    function(data) {
                        document.getElementById('message').innerHTML = data;
                        $('#message').slideDown('slow');
                        $('#submit-form img.loader').fadeOut('slow', function() {
                            $(this).remove()
                        });
                        $('#submit').removeAttr('disabled');
                        if (data.match('success') != null) $('#submit-form').slideUp('slow');
                    }
                );
            });
            return false;
        });
    });

})(jQuery);

// form validation
