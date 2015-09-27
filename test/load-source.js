/**
 * @file - Test utility to facilitate loading different builds of the source
 * code depending on the URL used to access the document.
 */
(function(window) {
	"use strict";
	var sources = {
		global: {
			prereqs: ["../srcdoc-polyfill.js"],
			setup: function(done) {
				done();
			}
		}
	};

	function loadScript(script, done) {
		var el = document.createElement("script");
		el.src = script;
		el.addEventListener("load", done);
		document.head.appendChild(el);
	}

	function loadScripts(scripts, done) {
		if (scripts.length === 0) {
			setTimeout(done, 0);
			return;
		}
		loadScript(scripts.shift(), function() {
			loadScripts(scripts, done);
		});
	}

	function getSource(search) {
		var params = search.slice(1).split("&");
		var sourceName = "global";
		params.forEach(function(param) {
			var parts = param.split("=");
			if (parts[0] === "testSource") {
				sourceName = parts[1];
			}
		});
		return sourceName;
	}

	window.loadSource = function(location, done) {
		var source = sources[getSource(location.search)];
		loadScripts(source.prereqs, function() {
			source.setup(done);
		});
	};
}(this));
