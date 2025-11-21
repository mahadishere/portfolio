/**
 * Intro Video Forward/Reverse Loop Management
 */
(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		const videoForward = document.getElementById('intro-video-forward');
		const videoReverse = document.getElementById('intro-video-reverse');
		const posterImg = document.getElementById('intro-video-poster');
		
		if (!videoForward || !videoReverse) return;

		// Track video loading state
		let forwardVideoLoaded = false;
		let reverseVideoLoaded = false;
		
		// Function to load and start forward video
		function loadAndPlayForwardVideo() {
			if (!forwardVideoLoaded) {
				// Hide poster, show video
				if (posterImg) posterImg.style.display = 'none';
				videoForward.style.display = 'block';
				
				// Add source element only when we want to load the video
				const src = videoForward.getAttribute('data-src');
				if (src && !videoForward.querySelector('source')) {
					const source = document.createElement('source');
					source.src = src;
					source.type = 'video/mp4';
					videoForward.appendChild(source);
				}
				// Load video asynchronously (non-blocking)
				videoForward.load();
				forwardVideoLoaded = true;
				
				// Wait for video to be ready, then play
				videoForward.addEventListener('canplay', function playOnce() {
					// Play video asynchronously
					videoForward.play().catch(e => {
						console.log('Video autoplay blocked, will play on user interaction');
					});
					videoForward.removeEventListener('canplay', playOnce);
					
					// After first video is loaded, schedule second video load in idle time
					if (window.requestIdleCallback) {
						window.requestIdleCallback(function() {
							loadReverseVideo();
						}, { timeout: 1000 });
					} else {
						// Fallback: load after small delay
						setTimeout(function() {
							loadReverseVideo();
						}, 100);
					}
				}, { once: true });
			} else if (videoForward.paused) {
				videoForward.play().catch(e => console.log('Video play failed:', e));
			}
		}
		
		// Function to load reverse video (non-blocking)
		function loadReverseVideo() {
			if (!reverseVideoLoaded) {
				const src = videoReverse.getAttribute('data-src');
				if (src && !videoReverse.querySelector('source')) {
					const source = document.createElement('source');
					source.src = src;
					source.type = 'video/mp4';
					videoReverse.appendChild(source);
				}
				// Load video asynchronously (non-blocking)
				videoReverse.load();
				reverseVideoLoaded = true;
			}
		}
		
		// Wait for entire website to load before loading videos
		// This ensures all resources (images, CSS, JS) are loaded first
		// Use requestIdleCallback for non-blocking video loading when browser is idle
		function scheduleVideoLoad() {
			if (window.requestIdleCallback) {
				// Use browser's idle time for non-blocking loading
				window.requestIdleCallback(function() {
					if (!forwardVideoLoaded) {
						loadAndPlayForwardVideo();
					}
				}, { timeout: 2000 }); // Fallback after 2 seconds if browser never becomes idle
			} else {
				// Fallback for browsers without requestIdleCallback
				setTimeout(function() {
					if (!forwardVideoLoaded) {
						loadAndPlayForwardVideo();
					}
				}, 100);
			}
		}
		
		if (document.readyState === 'complete') {
			// Page already fully loaded, schedule video load in idle time
			scheduleVideoLoad();
		} else {
			// Wait for window.load event (fires when all resources are loaded)
			window.addEventListener('load', function() {
				// Schedule video loading in browser's idle time (non-blocking)
				scheduleVideoLoad();
			});
		}
		
		// When forward video is near the end, prepare reverse
		videoForward.addEventListener('timeupdate', function() {
			if (this.duration && this.currentTime >= this.duration - 0.5) {
				// Pre-start reverse video just before forward ends
				// (Reverse video should already be loaded after first video loaded)
				if (reverseVideoLoaded && videoReverse.paused) {
					videoReverse.currentTime = 0;
					videoReverse.play().catch(e => {});
				} else if (!reverseVideoLoaded) {
					// If somehow not loaded yet, load it now
					loadReverseVideo();
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
			if (posterImg) posterImg.style.display = 'none';
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
			if (posterImg) posterImg.style.display = 'none';
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

