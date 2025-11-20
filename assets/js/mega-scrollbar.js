/**
 * Faux Scrollbar Sync for Mega Menu
 */
(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		const catScroller = document.querySelector('.mega-categories');
		const track = document.querySelector('.mega-scrollbar');
		const thumb = document.querySelector('.mega-scrollbar-thumb');

		if (!catScroller || !track || !thumb) return;

		function updateThumb() {
			const visible = catScroller.clientWidth;
			const total = catScroller.scrollWidth;
			const trackW = track.clientWidth;
			const ratio = Math.max(visible / total, 0.05);
			const thumbW = Math.max(trackW * ratio, 20);
			const maxLeft = trackW - thumbW;
			const scrollRatio = catScroller.scrollLeft / (total - visible || 1);
			const left = maxLeft * scrollRatio;
			thumb.style.width = `${thumbW}px`;
			thumb.style.transform = `translateX(${left}px)`;
		}

		let dragging = false;
		let dragStartX = 0;
		let dragStartLeft = 0;

		function onThumbDown(e) {
			dragging = true;
			dragStartX = e.clientX;
			const matrix = new DOMMatrix(getComputedStyle(thumb).transform);
			dragStartLeft = matrix.m41 || 0;
			e.preventDefault();
		}
		
		function onMove(e) {
			if (!dragging) return;
			const trackW = track.clientWidth;
			const thumbW = thumb.clientWidth;
			const maxLeft = trackW - thumbW;
			let left = Math.min(Math.max(dragStartLeft + (e.clientX - dragStartX), 0), maxLeft);
			thumb.style.transform = `translateX(${left}px)`;
			// Map thumb to scrollLeft
			const total = catScroller.scrollWidth;
			const visible = catScroller.clientWidth;
			const scrollMax = total - visible;
			catScroller.scrollLeft = (left / maxLeft) * scrollMax;
		}
		
		function onUp() { 
			dragging = false; 
		}

		function onTrackClick(e) {
			if (e.target === thumb) return; // handled by drag
			const rect = track.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const total = catScroller.scrollWidth;
			const visible = catScroller.clientWidth;
			const trackW = track.clientWidth;
			const targetRatio = clickX / trackW;
			catScroller.scrollLeft = targetRatio * (total - visible);
		}

		catScroller.addEventListener('scroll', updateThumb, { passive: true });
		window.addEventListener('resize', updateThumb);
		thumb.addEventListener('mousedown', onThumbDown);
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
		track.addEventListener('mousedown', onTrackClick);
		
		// Update when menu opens (hover)
		const workItem = document.querySelector('.nav-item-work');
		if (workItem) {
			workItem.addEventListener('mouseenter', updateThumb);
			workItem.addEventListener('focusin', updateThumb);
		}
		updateThumb();
	});
})();

