/**
 * Intro Video Forward/Reverse Loop Management
 */
(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		const videoForward = document.getElementById('intro-video-forward');
		const videoReverse = document.getElementById('intro-video-reverse');
		
		if (!videoForward || !videoReverse) return;

		// Track video loading state
		let forwardVideoLoaded = false;
		let reverseVideoLoaded = false;
		
		// Function to load and start forward video
		function loadAndPlayForwardVideo() {
			if (!forwardVideoLoaded) {
				// Add source element only when we want to load the video
				const src = videoForward.getAttribute('data-src');
				if (src && !videoForward.querySelector('source')) {
					const source = document.createElement('source');
					source.src = src;
					source.type = 'video/mp4';
					videoForward.appendChild(source);
				}
				videoForward.load();
				forwardVideoLoaded = true;
				// Wait for video to be ready, then play
				videoForward.addEventListener('canplay', function playOnce() {
					videoForward.play().catch(e => {
						console.log('Video autoplay blocked, will play on user interaction');
					});
					videoForward.removeEventListener('canplay', playOnce);
				}, { once: true });
			} else if (videoForward.paused) {
				videoForward.play().catch(e => console.log('Video play failed:', e));
			}
		}
		
		// Function to load reverse video
		function loadReverseVideo() {
			if (!reverseVideoLoaded) {
				const src = videoReverse.getAttribute('data-src');
				if (src && !videoReverse.querySelector('source')) {
					const source = document.createElement('source');
					source.src = src;
					source.type = 'video/mp4';
					videoReverse.appendChild(source);
				}
				videoReverse.load();
				reverseVideoLoaded = true;
			}
		}
		
		// Wait for entire website to load before loading videos
		// This ensures all resources (images, CSS, JS) are loaded first
		if (document.readyState === 'complete') {
			// Page already fully loaded, load video immediately
			loadAndPlayForwardVideo();
		} else {
			// Wait for window.load event (fires when all resources are loaded)
			window.addEventListener('load', function() {
				// Small delay to ensure everything is rendered
				setTimeout(function() {
					if (!forwardVideoLoaded) {
						loadAndPlayForwardVideo();
					}
				}, 100);
			});
		}
		
		// When forward video is near the end, load and prepare reverse
		videoForward.addEventListener('timeupdate', function() {
			if (this.duration && this.currentTime >= this.duration - 0.5) {
				// Load reverse video when forward is 0.5 seconds from end
				loadReverseVideo();
				// Pre-start reverse video just before forward ends
				if (reverseVideoLoaded && videoReverse.paused) {
					videoReverse.currentTime = 0;
					videoReverse.play().catch(e => {});
				} else if (!reverseVideoLoaded) {
					// Wait for video to load first
					videoReverse.addEventListener('canplay', function playOnce() {
						if (videoReverse.paused) {
							videoReverse.currentTime = 0;
							videoReverse.play().catch(e => {});
						}
						videoReverse.removeEventListener('canplay', playOnce);
					}, { once: true });
				}
			}
		});
		
		// When reverse video is near the end, prepare forward
		videoReverse.addEventListener('timeupdate', function() {
			if (this.duration && this.currentTime >= this.duration - 0.5) {
				// Pre-start forward video just before reverse ends
				if (videoForward.paused) {
					videoForward.currentTime = 0;
					videoForward.play().catch(e => {});
				}
			}
		});
		
		// When forward video ends, switch to reverse
		videoForward.addEventListener('ended', function() {
			videoForward.style.display = 'none';
			videoReverse.style.display = 'block';
			// Reverse video should already be playing from timeupdate
			if (videoReverse.paused) {
				videoReverse.currentTime = 0;
				videoReverse.play().catch(e => console.log('Reverse video play failed:', e));
			}
		});
		
		// When reverse video ends, switch back to forward (creates loop)
		videoReverse.addEventListener('ended', function() {
			videoReverse.style.display = 'none';
			videoForward.style.display = 'block';
			// Forward video should already be playing from timeupdate
			if (videoForward.paused) {
				videoForward.currentTime = 0;
				videoForward.play().catch(e => console.log('Forward video play failed:', e));
			}
		});
		
		// Play video on any user interaction (click, scroll, etc.) - loads video if not loaded yet
		// But only if page is already loaded
		const playVideo = () => {
			// Only load video on interaction if page is fully loaded
			if (document.readyState === 'complete') {
				if (!forwardVideoLoaded) {
					loadAndPlayForwardVideo();
				} else if (videoForward.style.display !== 'none' && videoForward.paused) {
					videoForward.play().catch(e => console.log('Video play failed:', e));
				} else if (videoReverse.style.display !== 'none' && videoReverse.paused) {
					videoReverse.play().catch(e => console.log('Video play failed:', e));
				}
			}
		};
		
		// Listen for user interactions (loads video if page is loaded)
		document.addEventListener('click', playVideo, { once: true });
		document.addEventListener('scroll', playVideo, { once: true });
		document.addEventListener('touchstart', playVideo, { once: true });
	});
})();

