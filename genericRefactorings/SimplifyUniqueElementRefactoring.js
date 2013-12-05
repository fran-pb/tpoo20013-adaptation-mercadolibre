var metadata = {"author":"Diego Paez, Francisco Peña", "name":"Simplify Element", "description":"This generic refactoring transforms a complex element which lost focus on some way to a simpler version wich does not loses focus (improves navegability).","id":"simplifyelement-dpaez-fpena"};

let console = (Cu.import("resource://gre/modules/devtools/Console.jsm", {})).console;

/**
 * [SimplifyElement Description ]
 * @param  {TYPE} description
 * @return {[type]}         [description]
 */

function SimplifyElement( name ){
  this.name = name;
  this.targetElement = undefined;
  this.targetResult = undefined;
  this.targetRelative = undefined;
}

SimplifyElement.prototype = new AbstractGenericRefactoring();

/**
 * Refactoring API below
 */

SimplifyElement.prototype.adaptDocument = function( doc ){
  this.simplify( doc );
};

SimplifyElement.prototype.setTargetElements = function( aXpath ){
  this.targetElement = aXpath;
};

SimplifyElement.prototype.setElementToAppendResult = function( aXpath ){
  this.targetResult = aXpath;
};

SimplifyElement.prototype.setRelativeData = function( relatives ){
  this.targetRelative = relatives;
};

SimplifyElement.prototype.addRelativeSection = function( title, rel_xPath, ifEmpty, keepOriginal ){
  keepOriginal = keepOriginal || false;
  this.targetRelative = {title: title, rel_xPath: rel_xPath, ifEmpty: ifEmpty, keepOriginal: keepOriginal};
};

/**
 * Custom refactoring methods below
 */

/**
 * [simplify Genera un elemento 'screen-reader-friendly' usando información enviada por el usuario.]
 * @param  {Object} doc [objeto representando el documento HTML]
 * @return {[type]}     [description]
 */
SimplifyElement.prototype.simplify = function( doc ){
  var elements = []
    , elementsForRemoving = []
    , targetElements
    , targetResult
    , element
    , spanRoolNode
    , newSpanNode
    , sectionTitle
    , rel_xPath
    , ifEmpty
    , containerNode;

  console.log( "[SimplifyElement] Main Method: starting..." );

  element = doc.evaluate( this.targetElement, doc, null, XPathResult.ANY_TYPE, null );
  targetResult = doc.evaluate( this.targetResult, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );

  console.log( "[SimplifyElement] Main Method: creo la nueva lista y la inserto dentro de targetResult" );

  if ( typeof targetResult.singleNodeValue === 'undefined' ){
    throw 'There was an error evaluating the targetResult';
  }

  targetNodeResult = targetResult.singleNodeValue;

  spanRoolNode = doc.createElement( 'ol' );
  spanRoolNode.classList.add( 'SimplifyElementRefactoring' );

  console.log( "[SimplifyElement] Main Method: recorro los elementos a transformar" );

  
  console.log( "  - Procesando el elemento: ", element.getAttribute( 'id' ) );

  newSpanNode = doc.createElement( 'span' );
  newSpanNode.classList.add( element.getAttribute( 'id' ) );

  for ( var key in this.targetRelative ) {
    sectionTitle = this.targetRelative[ key ].title;
    rel_xPath = this.targetRelative[ key ].rel_xPath;
    ifEmpty = this.targetRelative[ key ].ifEmpty;
    keepOriginal = this.targetRelative[ key ].keepOriginal;
    
    console.log( "  - Procesando la subseccion: ", sectionTitle );

    targetNode = doc.evaluate( rel_xPath, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );

    if ( targetNode !== null && targetNode.singleNodeValue ){
      console.log( "  - Es un nodo NO vacio" );
      node = targetNode.singleNodeValue;
      
      if ( true === keepOriginal ){
        console.log( "  - tengo que mantenerlo original [keepOriginal: true]" );
        newNode = node.cloneNode(); 
      } else {
        console.log( "  - tengo que crear texto [keepOriginal: false]" );
        newNode = node.textContent;
      }
    } else {
      console.log( "  - Es un nodo VACIO" );
      newNode = ifEmpty;
    }

    console.log( "  - Creo el elemento <P> para contener la nueva info" );
    containerNode = doc.createElement( "p" );
    
    if ( true === keepOriginal ){
      if ( targetNode !== null && targetNode.singleNodeValue ){
        child = newNode;
      } else {
        child = doc.createTextNode( "Vacio" );
      }
    } else {
      console.log( "  - creo el textNode " );
      child = doc.createTextNode(sectionTitle + ": " + newNode);
    }

    console.log( "  - appendChild del textNode al container" );
    containerNode.appendChild( child );
    
    containerNode.setAttribute( "tabindex", 0 );
    
    console.log( "  - appendChild del container al liNode" );
    newSpanNode.appendChild( containerNode );
  }

  elementsForRemoving.push( element );
  elements.push( newSpanNode );
  

  console.log( "[SimplifyElement] Main Method: armando el nuevo listado" );
  targetNodeResult.appendChild( spanRoolNode );
  for ( var i = 0; i < elements.length; i++ ){
    spanRoolNode.appendChild( elements[ i ] );
  }

  this.hideElements( elementsForRemoving );

  this.addRule( doc, "p:focus", "display: inline-block; border-style: solid; border-width: 1px; border-color: blue;" );

  console.log( "[SimplifyElement] Main Method: finishing..." );
};


SimplifyElement.prototype.hideElements = function( elementsToHide ){
  var item;
  for ( var i = 0 ; i < elementsToHide.length; i++ ){
    item = elementsToHide[ i ];
    if ( item.style ){
      item.style.display = "none";
    }
  }
};

/**
 * Extra / Utils
 */

SimplifyElement.prototype.addRule = function( doc, sel, css ) {
  // Works in IE6
  var rule = sel + " { " + css + " }";

  //doc.styleSheets[0].insertRule( rule, 0 );
  console.log( 'rule is: ', rule );
  var div = doc.createElement( "div" );
  div.innerHTML = "&shy;<style>" + rule + "</style>";
  doc.body.appendChild( div.childNodes[1] );

};


var exportedObjects = { "GenericRefactoring":SimplifyElement };