// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)


define.class(function(){
// Baseclass for all implementations of the layer subsystem

// Layer should render its output to 1 or more hidden buffers.
// the parent of the layer is responsible for displaying the content somehow. This could be a deferred rendering setup, an appleblur or a straight bitblt.

// Layer has 2 modes:
// - 2d
// - 3d

// The layer 2d mode provides:
// - flexbox layout engine
// (- dirtyrect handling?)
// - an orthagonal projection matrix

// the layer 3d mode provides:
// - a perspective matrix based on:
//		- ortho/perspective mode
//		- FOV
//		- lookat position
//		- camera position
//		- up vector

// - draw order based on:
// 		- front to back / grouped by material for solid materials
//		- back to front for transparent objects

// "passes" array - could be interesting for deferred/ui picking setups.


	
	
})