var metadata = {"author" : "Diego Paez, Francisco Peña", "name" : "Simple Map Reduce", "description" : "lorem ipsum" , "id":"simple-map-reduce-fpena-dpaez"};

let console = (Cu.import("resource://gre/modules/devtools/Console.jsm", {})).console;

/**
 * [SimpleMapReduce Description ]
 * @param  {TYPE} description
 * @return {[type]}         [description]
 */

function SimpleMapReduce( name ){
	this.name = name;
	this.targetElement = undefined;
	this.targetCallback = undefined;
}

SimpleMapReduce.prototype = new AbstractGenericRefactoring();

/**
 * Refactoring API below
 */

SimpleMapReduce.prototype.adaptDocument = function( doc ){
	this.start( doc );
};

SimpleMapReduce.prototype.setTargetElement = function( aXpath ){
	this.targetElement = aXpath;
};

SimpleMapReduce.prototype.setCallbackFunction = function( callback ){
	this.targetCallback = callback;
};

/**
 * Custom refactoring methods below
 */
 
SimpleMapReduce.prototype.allDescendants = function( node, callback ) {

  for ( var i = 0; i < node.children.length; i++ ) {
    var child = node.children[i];
    
    this.allDescendants(child, callback);
    callback(child);
  }
}

SimpleMapReduce.prototype.start = function( doc ){
  console.log( "[SimpleMapReduce] Main Method: starting..." );
	
	var rootNode = doc.evaluate( this.targetElement, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
	var node = rootNode.singleNodeValue;
	
	this.allDescendants( node, this.targetCallback );

	console.log( "[SimpleMapReduce] Main Method: finishing..." );
};

var exportedObjects = { "GenericRefactoring":SimpleMapReduce };