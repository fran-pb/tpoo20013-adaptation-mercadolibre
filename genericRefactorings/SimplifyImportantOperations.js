"use strict";

var metadata = {"author":"Diego Paez", "name":"Simplify Important Operations", "description":"This generic refactoring transforms a complex element containing important operations (according to context) which lost focus on some way to a simpler version wich does not loses focus (improves navegability).","id":"simplifyoperations-dpaez"};

let console = (Cu.import("resource://gre/modules/devtools/Console.jsm", {})).console;

function SimplifyImportantOperations( name ){
  this.name = name;
  this.rootElement = undefined;

  this.definitions = [];
  this.operations = [];
  this.operationContainers = {};

  // contains a list of node elements ready to be modified.
  this._elements = [];

  this._rootEl = undefined;

  console.log( "SimplifyImportantOperations: construction" );
}

SimplifyImportantOperations.prototype = new AbstractGenericRefactoring();

SimplifyImportantOperations.prototype.adaptDocument = function( doc ){
  this.simplifyOps( doc );
};

/**
 * Refactoring API below
 */

/**
 * setMainElement Set refactoring root element. This element should contain "important" operations.
 * @param {String} aXpath Main elements xpath.
 */
SimplifyImportantOperations.prototype.setMainElement = function( aXpath ){
  this.rootElement = aXpath;
};

/**
 * defineElement Permite re-definir contenido textual con una etiqueta que lo introduzca.
 * @param  {String} aString Un string usado como etiqueta para el contenido.
 * @param  {String} aXpath  Un xpath indicando el contenido.
 * @return {}
 */
SimplifyImportantOperations.prototype.defineElement = function( aString, aXpath ){
  if ( !(aString && aXpath) ){ return; }

  var definition = {
    title: aString,
    xpath: aXpath
  };

  this.definitions.push( definition );
};

/**
 * defineOperation Permite re-definir elementos complejos, usualmente con algun tipo de animación, en elementos "screen-reader friendly".
 * @param  {String} aString Un string usado para definir un título para la operación.
 * @param  {String} aXpath  Un xpath para indicar la operación.
 * @return {}
 */
SimplifyImportantOperations.prototype.defineOperation = function( aString, aXpath ){
  if ( !(aString && aXpath) ){ return; }

  var operation = {
    title: aString,
    xpath: aXpath,
  };

  this.operations.push( operation );
};


/**
 * defineOperationContainer Permite definir una etiqueta que contendra determinadas operaciones definidas por el usuario.
 * @param  {String} aString Un string que define el valor de la etiqueta, usualmente un encabezado de nivel h2.
 * @return {String}         Regresa una clave usada para referenciar luego al contenedor.
 */
SimplifyImportantOperations.prototype.defineOperationContainer = function( aString ){
  if ( typeof aString === 'undefined' ){
    throw "Es necesario definir una etiqueta que identifique al contenedor."
  }

  var titleKey = this.getKey( aString );
  this.operationContainers[ titleKey ] = {};

  // maybe this is useless...
  this.defineOperation( aString, null );

  return titleKey;
};

SimplifyImportantOperations.prototype.addAction = function( aKey, aTitle, aXpath, anURL ){
  if ( typeof aKey === 'undefined' ){
    throw "Es necesario indicar una clave."
  }

  if ( typeof aTitle === 'undefined' ){
    throw "Es necesario definir una etiqueta para identificar la acción.";
  }

  aXpath = aXpath || false;
  anURL = anURL || false;

  if ( (!aXpath) || (!anURL) ){
    throw "Es necesario indicar al menos un xpath o una url para obtener la acción";
  }

  var content
    , rootTitle;

  // Update operation containers with received title, xpath and url for the new action element.
  this.operationContainers[ aKey ] = {
    title: aTitle,
    xpath: aXpath,
    url: anURL
  };

}


/**
 * Custom refactoring methods below
 */


/**
 * simplifyOps Metodo principal, dispara las distintas transformaciones al dom indicadas por el usuario.
 * @param  {Object} doc Es un objeto que representa al 'document'.
 * @return {}
 */
SimplifyImportantOperations.prototype.simplifyOps = function( doc ){
  console.log( "Function: simplifyOps | Status: starting" );

  var xroot
    , xrootEl
    , rootTitle
    , definitionList;

  xroot = doc.evaluate( this.rootElement, doc, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null );
  console.log( 'xroot: ', xroot );

  xrootEl = xroot.iterateNext() || false;

  if ( xrootEl ){
    // any first gen child should be fine to get the parent/root.
    this._rootEl = xrootEl.parentNode;
  } else{
    // TODO: check if this actually works...
    this._rootEl = xroot.parentNode;
  }

  // Populate _elements internal array. This is going to be used to manipulate DOM.
  while( xrootEl ){
    this._elements.push( xrootEl );
    xrootEl = xroot.iterateNext();
  }

  console.log( "Hiding main element childs..." );
  // Hiding all root elements (child) operations.
  this.hideElements( this._elements );

  console.log( "Creating new list..." );

  // create new (child) container, new list element and items for user definition elements.
  // iterate and create a new list of elements.
  definitionList = this.parseDefinitionElements( doc, this.definitions );
  // TODO: iterate and create a new list of operations.
  // operationList = this.parseOperationElements( doc, this.operations );


  rootTitle = doc.createElement( "h2" );
  rootTitle.appendChild( doc.createTextNode("Descripci\u00F3n del producto") );
  this._rootEl.appendChild( rootTitle );

  definitionList.setAttribute( "role", "article" );

  console.log( "definitionList: ", definitionList );
  this._rootEl.appendChild( definitionList );

  //this.addRule(doc, "li:focus", "display: inline-block; border-style: solid; border-width: 1px; border-color: blue;");
  this.addFocusBorder( doc, ".refactored > *:focus" );
};

SimplifyImportantOperations.prototype.parseDefinitionElements = function( doc, definitions ){
  var definition
    , definitionList
    , definitionElementLI
    , definitionTitle
    , definitionTitleValue
    , definitionContent
    , definitionContentValue;

  definitionList = doc.createElement( "ul" );

  for ( var i = 0; i < definitions.length; i++ ){
    definition = definitions[ i ];

    definitionElementLI = doc.createElement( "li" );
    definitionElementLI.classList.add( "refactored" );

    definitionTitle = doc.createElement( "h3" );
    definitionTitleValue = doc.createTextNode( definition.title + ": ");
    definitionTitle.appendChild( definitionTitleValue );
    definitionTitle.setAttribute( "tabindex", 0 );

    definitionContent = doc.createElement( "span" );
    definitionContentValue = doc.evaluate( definition.xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
    if ( definitionContentValue.singleNodeValue ){
      var nodeValue = definitionContentValue.singleNodeValue;
      // console.log( nodeValue );
      var text = "";
      if ( nodeValue.itemValue ){
        text = nodeValue.itemValue;
      }
      if ( nodeValue.textContent ){
        text = nodeValue.textContent;
      }
      definitionContent.appendChild( doc.createTextNode(text) );
    }
    definitionContent.setAttribute( "tabindex", 0 );

    definitionElementLI.appendChild( definitionTitle );
    definitionElementLI.appendChild( definitionContent );

    definitionList.appendChild( definitionElementLI );
  }

  return definitionList;
};

SimplifyImportantOperations.prototype.parseOperationElements = function( operations ){

};


SimplifyImportantOperations.prototype.hideElements = function( elementsToHide ){
  var item;
  for ( var i = 0 ; i < elementsToHide.length; i++ ){
    item = elementsToHide[ i ];
    if ( item.style ){
      item.style.visibility = "hidden";
    }
  }
};


/**
 * Extra / Utils
 */

SimplifyImportantOperations.prototype.addRule = function( doc, sel, css ) {
  // Works in IE6
  var rule = sel + "{ " + css + " }";

  //doc.styleSheets[0].insertRule( rule, 0 );
  console.log( 'rule is: ', rule );
  var div = doc.createElement( "div" );
  div.innerHTML = "&shy;<style>" + rule + "</style>";
  doc.body.appendChild( div.childNodes[1]);

};

SimplifyImportantOperations.prototype.addFocusBorder = function( doc, element, width, style, color ){
  if ( typeof element === 'undefined' ){
    throw "element must be defined";
  }

  width = width || "1px";
  style = style || "solid";
  color = color || "blue";

  var finalRule = "";
  var ruleBorder = "border: " + width + " " + style + " " + color + "; ";
  var ruleDisplay = "display: inline-block;";

  finalRule = ruleDisplay + " " + ruleBorder;
  console.log( "border focus rule: ", finalRule)

  this.addRule(doc, element, finalRule);
}

SimplifyImportantOperations.prototype.getKey = function( aString ){
  if ( typeof aString !== 'string' ){
    return undefined;
  }
  return aString.trim().replace(' ', '-', 'g').toLowerCase();
}

/**
 * Define exported refactoring object
 */

var exportedObjects = { "GenericRefactoring":SimplifyImportantOperations };