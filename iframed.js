/*
 * iframed.js v1.3.1
 * https://github.com/tokkonopapa/iframed.js
 *
 * iframed.js is an asynchronous loader for 3rd party's javascript.
 * This improves the site response even if the script uses document.write()
 * in a recursive way.
 *
 * NOTICE: Make sure to set the path to your 'fiframe.html'
 *
 * Copyright 2013, tokkonopapa
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/*
 * Iframe main function
 */
function createIframe(id, ad, style, min_height, stylesheet) {
	// Keep params in iframe object
	var iframe = document.createElement('iframe');
	iframe.id = id + '-iframe';
	iframe.min_height = min_height ? parseInt(min_height, 10) : 0;
	iframe.stylesheet = stylesheet ? stylesheet.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : null;

	iframe.style.cssText = style;
	iframe.setAttribute('frameborder', 0);
	iframe.setAttribute('scrolling', 'no');
	iframe.setAttribute('marginheight', 0);
	iframe.setAttribute('marginwidth', 0);
	iframe.setAttribute('allowtransparency', 'true');

	// Attach first to make body in iframe
	iframe.src = "javascript:false";
	document.getElementById(id).appendChild(iframe);

	// Contents in iframe
	var html = '<head>';
	html += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">';
	html += '<base target="_top">';

	// Add stylesheet
	if (iframe.stylesheet) {
		html += '<link rel="stylesheet" type="text/css" href="' + iframe.stylesheet + '" media="all" \/>';
	}

	// Reset some styles
	html += '<style>';
	html +=     'body { margin: 0; padding: 0; }';
	html += '<\/style>';

	// Onload event handler
	html += '<script>';
	html += 'function resizeIframe() {';
	html +=     'var a = document.body,';
	html +=         'b = document.documentElement,';
	html +=         'c = Math.max(a.offsetTop, 0),';
	html +=         'd = Math.max(b.offsetTop, 0),';
	html +=         'e = a.scrollHeight + c,';
	html +=         'f = a.offsetHeight + c,';
	html +=         'g = b.scrollHeight + d,';
	html +=         'h = b.offsetHeight + d,';
	html +=         'i = Math.max(e, f, g, h);';
	html +=     'if (b.clientTop > 0) i += (b.clientTop * 2);';
	html +=     'var iframe = window.frameElement;';
	html +=     'var elem = window.parent.document.getElementById(iframe.id);';
	html +=     'elem.style.height = i + "px";';
	html +=     'if (i < iframe.min_height) setTimeout(resizeIframe, 1000);';
	html += '}';
	html += '<\/script>';
	html += '<\/head>';
	html += '<body onload="resizeIframe()">';
	html += ad;

	var doc = (iframe.contentWindow || iframe.contentDocument);
	if (doc.document) {
		doc = doc.document;
	}
	doc.open().write(html);
	doc.close();
}

/*
 * Helper function to invoke creating iframe after onload
 */
function lazyStart(callback) {
	var args = ([].slice.call(arguments)).slice(1);
	if (window.addEventListener) {
		window.addEventListener('load', function() {
			callback.apply({}, args);
		}, false);
	} else {
		window.attachEvent('onload', function() {
			callback.apply({}, args);
		});
	}
}

/* start script after onload */
function lazyLoadIframe(id, ad, style, min_height, stylesheet) {
	lazyStart(createIframe, id, ad, style, min_height, stylesheet);
}

/* start scripts all after onload */
function fireForceAsyncAll(adDataList) {
	var adDataListKeys = Object.keys(adDataList);
	for (var i = 0, len = adDataListKeys.length; i < len; i++) {
		var id         = adDataListKeys[i];
		var ad         = adDataList[id].ad;
		var style      = adDataList[id].style;
		var min_height = adDataList[id].min_height;
		var stylesheet = adDataList[id].stylesheet;
		var innertext  = adDataList[id].innertext;
		lazyStart(createIframe, id, ad, style, min_height, stylesheet);
	}
}

/* start script */
function fireForceAsync(adDataList, id) {
	var ad         = adDataList.ad;
	var style      = adDataList.style;
	var min_height = adDataList.min_height;
	var stylesheet = adDataList.stylesheet;
	var innertext  = adDataList.innertext;
	createIframe(id, ad, style, min_height, stylesheet)
}
