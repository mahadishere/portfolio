/**
 * Main Width Toggle Based on Active Panel
 */
(function() {
	'use strict';

	function updateMainWidth() {
		const main = document.getElementById('main');
		if (!main) return;
		
		// Check hash first for immediate feedback
		const hash = window.location.hash || '';
		const isHomePanel = hash === '#home' || hash === '' || hash === '#';
		
		if (isHomePanel) {
			// Also verify the panel is actually visible
			const introPanel = main.querySelector('.panel.intro');
			if (introPanel) {
				main.classList.add('has-intro');
				return;
			}
		}
		
		// Check for active intro panel (not inactive and visible)
		const introPanel = main.querySelector('.panel.intro');
		const isIntroActive = introPanel && 
			!introPanel.classList.contains('inactive') && 
			introPanel.style.display !== 'none' &&
			introPanel.offsetParent !== null; // Check if actually visible
		
		if (isIntroActive) {
			main.classList.add('has-intro');
		} else {
			main.classList.remove('has-intro');
		}
	}

	// Listen for hash changes and panel switches
	window.addEventListener('hashchange', function() {
		// Immediate check based on hash
		updateMainWidth();
		// Also check after panel transition completes (main.js uses 250ms + 500ms delays)
		setTimeout(updateMainWidth, 100);
		setTimeout(updateMainWidth, 300);
		setTimeout(updateMainWidth, 800); // After full transition
	});
	
	// Use MutationObserver to watch for panel class and style changes
	document.addEventListener('DOMContentLoaded', function() {
		// Initial check
		setTimeout(updateMainWidth, 100);
		
		const main = document.getElementById('main');
		if (main) {
			const observer = new MutationObserver(function(mutations) {
				// Debounce rapid changes
				clearTimeout(observer.timeout);
				observer.timeout = setTimeout(function() {
					updateMainWidth();
				}, 50);
			});
			
			const panels = main.querySelectorAll('.panel');
			panels.forEach(function(panel) {
				// Watch for class changes
				observer.observe(panel, { 
					attributes: true, 
					attributeFilter: ['class'],
					attributeOldValue: false
				});
				// Watch for style/display changes
				observer.observe(panel, { 
					attributes: true, 
					attributeFilter: ['style'],
					attributeOldValue: false
				});
			});
		}
	});
})();

