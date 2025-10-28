/*
	Astral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		$panels = $main.children('.panel'),
		$nav = $('#nav'), $nav_links = $nav.children('a');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '361px',   '736px'  ],
			xsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		$nav_links
			.on('click', function(event) {

				var href = $(this).attr('href');

				// Not a panel link? Bail.
					if (href.charAt(0) != '#'
					||	$panels.filter(href).length == 0)
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Change panels.
					if (window.location.hash != href)
						window.location.hash = href;

			});

	// Panels.

		// Initialize.
			(function() {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

					}

				// No panel/link? Default to first.
					if (!$panel
					||	$panel.length == 0) {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels except this one.
					$panels.not($panel)
						.addClass('inactive')
						.hide();

				// Activate link.
					$link
						.addClass('active');

				// Reset scroll.
					$window.scrollTop(0);

			})();

		// Hashchange event.
			$window.on('hashchange', function(event) {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

						// No target panel? Bail.
							if ($panel.length == 0)
								return;

					}

				// No panel/link? Default to first.
					else {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels.
					$panels.addClass('inactive');

				// Deactivate all links.
					$nav_links.removeClass('active');

				// Activate target link.
					$link.addClass('active');

				// Set max/min height.
					$main
						.css('max-height', $main.height() + 'px')
						.css('min-height', $main.height() + 'px');

				// Delay.
					setTimeout(function() {

						// Hide all panels.
							$panels.hide();

						// Show target panel.
							$panel.show();

						// Set new max/min height.
							$main
								.css('max-height', $panel.outerHeight() + 'px')
								.css('min-height', $panel.outerHeight() + 'px');

						// Reset scroll.
							$window.scrollTop(0);

						// Delay.
							window.setTimeout(function() {

								// Activate target panel.
									$panel.removeClass('inactive');

								// Clear max/min height.
									$main
										.css('max-height', '')
										.css('min-height', '');

								// IE: Refresh.
									$window.triggerHandler('--refresh');

								// Unlock.
									locked = false;

							}, (breakpoints.active('small') ? 0 : 500));

					}, 250);

			});

	// IE: Fixes.
		if (browser.name == 'ie') {

			// Fix min-height/flexbox.
				$window.on('--refresh', function() {

					$wrapper.css('height', 'auto');

					window.setTimeout(function() {

						var h = $wrapper.height(),
							wh = $window.height();

						if (h < wh)
							$wrapper.css('height', '100vh');

					}, 0);

				});

				$window.on('resize load', function() {
					$window.triggerHandler('--refresh');
				});

			// Fix intro pic.
				$('.panel.intro').each(function() {

					var $pic = $(this).children('.pic'),
						$img = $pic.children('img');

					$pic
						.css('background-image', 'url(' + $img.attr('src') + ')')
						.css('background-size', 'cover')
						.css('background-position', 'center');

					$img
						.css('visibility', 'hidden');

				});

		}

	// Enhanced Lightbox with Navigation for galleries
	$(document).ready(function() {
		const overlay = $('<div class="lightbox-overlay" role="dialog" aria-modal="true"></div>');
		const content = $('<div class="lightbox-content"></div>');
		const img = $('<img alt="Expanded image" />');
		const close = $('<span class="lightbox-close" aria-label="Close">×</span>');
		const prevBtn = $('<span class="lightbox-nav lightbox-prev" aria-label="Previous">‹</span>');
		const nextBtn = $('<span class="lightbox-nav lightbox-next" aria-label="Next">›</span>');
		
		content.append(img);
		overlay.append(content).append(close).append(prevBtn).append(nextBtn);
		$('body').append(overlay);

		let currentGallery = [];
		let currentIndex = 0;

		function updateImage() {
			if (currentGallery.length === 0) return;
			
			const currentItem = currentGallery[currentIndex];
			img.attr('src', currentItem.href);
			img.attr('alt', currentItem.alt);
			
			// Update navigation button states
			prevBtn.toggleClass('disabled', currentIndex === 0);
			nextBtn.toggleClass('disabled', currentIndex === currentGallery.length - 1);
			
			// Hide arrows if only one image
			if (currentGallery.length === 1) {
				prevBtn.hide();
				nextBtn.hide();
			} else {
				prevBtn.show();
				nextBtn.show();
			}
		}

		function showLightbox(galleryName, clickedIndex) {
			// Get all images from the same gallery
			currentGallery = [];
			$('.gallery-grid a[data-gallery="' + galleryName + '"]').each(function() {
				currentGallery.push({
					href: $(this).attr('href'),
					alt: $(this).find('img').attr('alt')
				});
			});
			
			currentIndex = clickedIndex;
			updateImage();
			overlay.addClass('active');
		}

		function navigate(direction) {
			if (direction === 'prev' && currentIndex > 0) {
				currentIndex--;
				updateImage();
			} else if (direction === 'next' && currentIndex < currentGallery.length - 1) {
				currentIndex++;
				updateImage();
			}
		}

		// Open lightbox on gallery image click
		$(document).on('click', '.gallery-grid a', function(e) {
			e.preventDefault();
			const galleryName = $(this).attr('data-gallery');
			const clickedIndex = $('.gallery-grid a[data-gallery="' + galleryName + '"]').index(this);
			showLightbox(galleryName, clickedIndex);
		});

		// Close lightbox
		overlay.on('click', function(e) {
			if (e.target === this || $(e.target).hasClass('lightbox-close')) {
				overlay.removeClass('active');
			}
		});

		// Navigation button clicks
		prevBtn.on('click', function(e) {
			e.stopPropagation();
			if (!$(this).hasClass('disabled')) {
				navigate('prev');
			}
		});

		nextBtn.on('click', function(e) {
			e.stopPropagation();
			if (!$(this).hasClass('disabled')) {
				navigate('next');
			}
		});

		// Keyboard navigation
		$(document).on('keydown', function(e) {
			if (!overlay.hasClass('active')) return;
			
			switch(e.key) {
				case 'ArrowLeft':
					if (currentIndex > 0) navigate('prev');
					break;
				case 'ArrowRight':
					if (currentIndex < currentGallery.length - 1) navigate('next');
					break;
				case 'Escape':
					overlay.removeClass('active');
					break;
			}
		});
	});

})(jQuery);