var MUTATION_OPTIONS = {
	childList: true, // observe direct children
	subtree: false, // and lower descendants too
	attributeOldValue: true,
	attributeFilter: ['data-loaded'],
	attributes: true
}

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
  }

document.addEventListener("DOMContentLoaded", function() {
	
	 
	var desktoMobileBgLazy = function(condition){
		$(".lozad[data-background]").each(function() {
			var images = $(this).attr("data-background").split(';');
			var numberOfImages = images.length;
			if(numberOfImages === 1) {
				$(this).attr("data-background-image", images[0].trim());
			} else if(numberOfImages === 2) {
				$(window).width() < 768 ? $(this).attr("data-background-image", images[1].trim()) : $(this).attr("data-background-image", images[0].trim());
			}
			
			
		});
		
	 }
	 
	 desktoMobileBgLazy('null');
	
	// Mutation observer section
    var mutationHandler = new MutationObserver(function (mutationList, observer){
		if(mutationList.length) {
        mutationList.forEach(function(mutation, index){
            if(mutation.type == 'attributes') {
				if(typeof onAttributeMutation !== "undefined") {
					onAttributeMutation(mutation);				
				} 
            }
		});
	}
    });
    
	var nodeArray = document.querySelectorAll('.lozad');
	// try {
	if(nodeArray.length) {
		nodeArray.forEach(function(currentNode, index){
		
			mutationHandler.observe(currentNode, MUTATION_OPTIONS);
		});
	}

	// for(var i=0; i<nodeArray.length; i++){


	// }
// } catch(err) {

// }
	
	var observer = lozad('.lozad', {	// passing a `NodeList` (e.g. `document.querySelectorAll()`) is also valid
		load: function(el) {
			
			if(el.hasAttribute('data-background-image')) {
				el.style.backgroundImage = "url('" + el.dataset.backgroundImage + "')";
			} else if(el.hasAttribute('data-src')) {
				el.src = el.dataset.src;
			}
		},
		loaded:function(e){
			$(e).removeClass('lazyLozadLoading lazyLozadLoading-Img32 lozadNoSrc');
		}
	});
	
	observer.observe();
	
	/*window resize desktop &mob image change script*/
	$(window).resize(function() {
		desktoMobileBgLazy("resize");
		document.querySelectorAll('.background-image.lozad').forEach(function(e){
			var imageUrl =  e.getAttribute('data-background-image');
			e.style.backgroundImage = "url("+imageUrl+")";
		});
	 });
});
   
 
	 

// Object.assign polyfill

/**********************************************************************/   

if (!Object.assign) {
	Object.defineProperty(Object, 'assign', {
	  enumerable: false,
	  configurable: true,
	  writable: true,
	  value: function(target) {
		'use strict';
		if (target === undefined || target === null) {
		  throw new TypeError('Cannot convert first argument to object');
		}
  
		var to = Object(target);
		for (var i = 1; i < arguments.length; i++) {
		  var nextSource = arguments[i];
		  if (nextSource === undefined || nextSource === null) {
			continue;
		  }
		  nextSource = Object(nextSource);
  
		  var keysArray = Object.keys(Object(nextSource));
		  for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
			var nextKey = keysArray[nextIndex];
			var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
			if (desc !== undefined && desc.enumerable) {
			  to[nextKey] = nextSource[nextKey];
			}
		  }
		}
		return to;
	  }
	});
  }

/**********************************************************************/   