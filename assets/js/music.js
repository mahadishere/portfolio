/**
 * Background Music Management
 */
(function() {
	'use strict';

	let musicPlaying = false;
	const audio = document.getElementById('background-music');
	const musicButton = document.querySelector('.music-toggle');

	if (!audio || !musicButton) return;

	function updateMusicIcon(playing) {
		musicButton.textContent = playing ? '🔊' : '🔇';
		musicButton.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
	}

	function toggleMusic() {
		if (musicPlaying) {
			audio.pause();
			musicPlaying = false;
			localStorage.setItem('musicPlaying', 'false');
			updateMusicIcon(false);
		} else {
			// Load audio source if not already loaded (lazy loading)
			if (audio.readyState === 0) {
				audio.load();
			}
			audio.play().then(() => {
				musicPlaying = true;
				localStorage.setItem('musicPlaying', 'true');
				updateMusicIcon(true);
			}).catch(e => {
				console.log('Error playing music:', e);
				musicPlaying = false;
				localStorage.setItem('musicPlaying', 'false');
				updateMusicIcon(false);
			});
		}
	}

	// Load saved music preference
	const savedMusicState = localStorage.getItem('musicPlaying');
	const shouldAutoPlay = savedMusicState === 'true' || savedMusicState === null; // null = first visit, try autoplay
	
	if (shouldAutoPlay) {
		// Lazy load audio only when user wants to play (don't load on page load)
		// Try to autoplay on first visit or if user previously had it playing
		const tryAutoPlay = () => {
			// Load audio source if not already loaded
			if (audio.readyState === 0) {
				audio.load();
			}
			audio.play().then(() => {
				musicPlaying = true;
				localStorage.setItem('musicPlaying', 'true');
				updateMusicIcon(true);
			}).catch(e => {
				// Autoplay blocked - user interaction required
				console.log('Music autoplay blocked. User interaction required to play music.');
				musicPlaying = false;
				if (savedMusicState === null) {
					// First visit - don't save preference yet
				} else {
					localStorage.setItem('musicPlaying', 'false');
				}
				updateMusicIcon(false);
				
				// Try to play on first user interaction
				const playMusicOnInteraction = () => {
					if (audio.paused && shouldAutoPlay) {
						if (audio.readyState === 0) {
							audio.load();
						}
						audio.play().then(() => {
							musicPlaying = true;
							localStorage.setItem('musicPlaying', 'true');
							updateMusicIcon(true);
						}).catch(e => console.log('Music play failed:', e));
					}
				};
				
				// Listen for first user interaction
				document.addEventListener('click', playMusicOnInteraction, { once: true });
				document.addEventListener('scroll', playMusicOnInteraction, { once: true });
				document.addEventListener('touchstart', playMusicOnInteraction, { once: true });
			});
		};
		
		// Only try autoplay after page is fully loaded (non-blocking)
		if (document.readyState === 'complete') {
			// Use requestIdleCallback to load audio when browser is idle
			if (window.requestIdleCallback) {
				window.requestIdleCallback(tryAutoPlay, { timeout: 3000 });
			} else {
				setTimeout(tryAutoPlay, 1000);
			}
		} else {
			window.addEventListener('load', () => {
				if (window.requestIdleCallback) {
					window.requestIdleCallback(tryAutoPlay, { timeout: 3000 });
				} else {
					setTimeout(tryAutoPlay, 1000);
				}
			});
		}
	} else if (savedMusicState === 'false') {
		// User explicitly turned it off
		musicPlaying = false;
		updateMusicIcon(false);
	}

	// Update icon when audio state changes
	audio.addEventListener('play', () => {
		musicPlaying = true;
		updateMusicIcon(true);
	});
	audio.addEventListener('pause', () => {
		musicPlaying = false;
		updateMusicIcon(false);
	});
	audio.addEventListener('ended', () => {
		musicPlaying = false;
		updateMusicIcon(false);
	});

	// Expose toggleMusic globally
	window.toggleMusic = toggleMusic;
})();

