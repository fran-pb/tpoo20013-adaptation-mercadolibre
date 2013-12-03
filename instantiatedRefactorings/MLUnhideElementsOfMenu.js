var metadata = {"author":"Diego Paez, Francisco Peña", "name":"Unhide elements", "description":"Lorem ipsun","id":"ML-unhide-dpaez-fpena"};

function getAccessibilityAugmenter(){
	return new MLUnhide();
};

function MLUnhide(){

};

MLUnhide.prototype = new AbstractInstanceRefactoring();

MLUnhide.prototype.setTargetURLs = function(){
  this.addTargetURL( /http:\/\/articulo.mercadolibre.com.ar/ );
	this.addTargetURL( /https:\/\/myaccount.mercadolibre.com.ar\/summary\// );
};

MLUnhide.prototype.initialize = function( language ){
	this.abstract_refactoring = new SimpleMapReduce.SimpleMapReduce( "Simple Map Reduce" );
	this.abstract_refactoring.setTargetElement( "/html/body/main/nav" );

	this.abstract_refactoring.setCallbackFunction( function( node ){
	  if ( (node.nodeName) && ('LI' === node.nodeName) ){ node.setAttribute('tabindex','0'); }
	  if ( node.classList ){
	    node.classList.remove( 'ch-hide' );
	  }
	  if ( node.style ){
	    node.style.visibility = 'visible';
	  }
	});
};

MLUnhide.prototype.adaptDocument = function(doc){
	var self = this;
	setTimeout(function(){self.abstract_refactoring.adaptDocument(doc)},3000);
};