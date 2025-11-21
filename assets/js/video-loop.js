/**
 * Intro Video Forward/Reverse Loop Management
 */
(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		const videoForward = document.getElementById('intro-video-forward');
		const videoReverse = document.getElementById('intro-video-reverse');
		
		if (!videoForward || !videoReverse) return;

		// Only preload forward video initially (reverse will load when needed)
		videoForward.load();
		
		// Track if reverse video has been loaded
		let reverseVideoLoaded = false;
		
		// When forward video is near the end, load and prepare reverse
		videoForward.addEventListener('timeupdate', function() {
			if (this.duration && this.currentTime >= this.duration - 0.5) {
				// Load reverse video when forward is 0.5 seconds from end
				if (!reverseVideoLoaded) {
					videoReverse.load();
					reverseVideoLoaded = true;
				}
				// Pre-start reverse video just before forward ends
				if (videoReverse.paused && reverseVideoLoaded) {
					videoReverse.currentTime = 0;
					videoReverse.play().catch(e => {});
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
		
		// Try to play the forward video initially
		videoForward.play().catch(e => {
			// Autoplay was blocked - this is normal in some browsers
			console.log('Video autoplay blocked, will play on user interaction');
		});
		
		// Play video on any user interaction (click, scroll, etc.)
		const playVideo = () => {
			if (videoForward.style.display !== 'none' && videoForward.paused) {
				videoForward.play().catch(e => console.log('Video play failed:', e));
			} else if (videoReverse.style.display !== 'none' && videoReverse.paused) {
				videoReverse.play().catch(e => console.log('Video play failed:', e));
			}
		};
		
		// Listen for user interactions
		document.addEventListener('click', playVideo, { once: true });
		document.addEventListener('scroll', playVideo, { once: true });
		document.addEventListener('touchstart', playVideo, { once: true });
	});
})();

