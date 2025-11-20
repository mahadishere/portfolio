/**
 * Theme Management (Dark Mode)
 */
(function() {
	'use strict';

	function toggleTheme() {
		const currentTheme = document.documentElement.getAttribute('data-theme');
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
		updateThemeIcon(newTheme);
	}

	function updateThemeIcon(theme) {
		const button = document.querySelector('.theme-toggle');
		if (button) {
			button.textContent = theme === 'dark' ? '☀️' : '🌙';
		}
	}

	// Initialize theme
	const savedTheme = localStorage.getItem('theme') || 'light';
	document.documentElement.setAttribute('data-theme', savedTheme);
	updateThemeIcon(savedTheme);

	// Expose toggleTheme globally
	window.toggleTheme = toggleTheme;
})();

