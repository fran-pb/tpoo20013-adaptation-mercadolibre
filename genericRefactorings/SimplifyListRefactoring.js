var metadata = {"author":"Diego Paez, Francisco Peña", "name":"Simplify List", "description":"This generic refactoring transforms a complex list which lost focus on some way to a simpler version wich does not loses focus (improves navegability).","id":"simplifylist-dpaez-fpena"};

let console = (Cu.import("resource://gre/modules/devtools/Console.jsm", {})).console;

/**
 * [SimplifyList Description ]
 * @param  {TYPE} description
 * @return {[type]}         [description]
 */

function SimplifyList( name ){
  this.name = name;
  this.targetElement = undefined;
  this.targetResult = undefined;
  this.targetRelatives = [];
}

SimplifyList.prototype = new AbstractGenericRefactoring();

/**
 * Refactoring API below
 */

SimplifyList.prototype.adaptDocument = function( doc ){
  this.simplify( doc );
};

SimplifyList.prototype.setTargetElements = function( aXpath ){
  this.targetElement = aXpath;
};

SimplifyList.prototype.setElementToAppendResult = function( aXpath ){
  this.targetResult = aXpath;
};

SimplifyList.prototype.setRelativeData = function( relatives ){
  this.targetRelatives = relatives;
};

SimplifyList.prototype.addRelativeSection = function( title, rel_xPath, ifEmpty, keepOriginal ){
  keepOriginal = keepOriginal || false;
  this.targetRelatives.push({title: title, rel_xPath: rel_xPath, ifEmpty: ifEmpty, keepOriginal: keepOriginal});
};

/**
 * Custom refactoring methods below
 */

/**
 * [simplify Genera una nueva lista 'screen-reader-friendly' usando información enviada por el usuario.]
 * @param  {Object} doc [objeto representando el documento HTML]
 * @return {[type]}     [description]
 */
SimplifyList.prototype.simplify = function( doc ){
  var elements = []
    , elementsForRemoving = []
    , targetElements
    , targetResult
    , element
    , olRootNode
    , newLiNode
    , sectionTitle
    , rel_xPath
    , ifEmpty
    , containerNode;

  console.log( "[SimplifyList] Main Method: starting..." );

  targetElements = doc.evaluate( this.targetElement, doc, null, XPathResult.ANY_TYPE, null );
  targetResult = doc.evaluate( this.targetResult, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );

  console.log( "[SimplifyList] Main Method: creo la nueva lista y la inserto dentro de targetResult" );

  if ( typeof targetResult.singleNodeValue === 'undefined' ){
    throw 'There was an error evaluating the targetResult';
  }

  targetNodeResult = targetResult.singleNodeValue;

  olRootNode = doc.createElement( 'ol' );
  olRootNode.classList.add( 'SimplifyListRefactoring' );

  console.log( "[SimplifyList] Main Method: recorro los elementos a transformar" );

  while ( element = targetElements.iterateNext() ){

    console.log( "  - Procesando el elemento: ", element.getAttribute( 'id' ) );

    newLiNode = doc.createElement( 'li' );
    newLiNode.classList.add( element.getAttribute( 'id' ) );

    for ( var key in this.targetRelatives ) {
      sectionTitle = this.targetRelatives[ key ].title;
      rel_xPath = this.targetRelatives[ key ].rel_xPath;
      ifEmpty = this.targetRelatives[ key ].ifEmpty;
      keepOriginal = this.targetRelatives[ key ].keepOriginal;
      
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
      newLiNode.appendChild( containerNode );
    }

    elementsForRemoving.push( element );
    elements.push( newLiNode );
  }

  console.log( "[SimplifyList] Main Method: armando el nuevo listado" );
  targetNodeResult.appendChild( olRootNode );
  for ( var i = 0; i < elements.length; i++ ){
    olRootNode.appendChild( elements[ i ] );
  }

  this.hideElements( elementsForRemoving );

  this.addRule( doc, "p:focus", "display: inline-block; border-style: solid; border-width: 1px; border-color: blue;" );

  console.log( "[SimplifyList] Main Method: finishing..." );
};


SimplifyList.prototype.hideElements = function( elementsToHide ){
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

SimplifyList.prototype.addRule = function( doc, sel, css ) {
  // Works in IE6
  var rule = sel + " { " + css + " }";

  //doc.styleSheets[0].insertRule( rule, 0 );
  console.log( 'rule is: ', rule );
  var div = doc.createElement( "div" );
  div.innerHTML = "&shy;<style>" + rule + "</style>";
  doc.body.appendChild( div.childNodes[1] );

};


var exportedObjects = { "GenericRefactoring":SimplifyList };