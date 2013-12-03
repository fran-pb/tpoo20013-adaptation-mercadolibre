"use strict";

var metadata = {"author":"Diego Paez", "name":"Simplify Product Page Main Operations", "description":"Transforms a complex box with important operations into a navegable element.","id":"simplifyProductOps-ML-dpaez"};

function getAccessibilityAugmenter(){
  return new MLSimplifyProductOperations();
}

function MLSimplifyProductOperations(){

}

MLSimplifyProductOperations.prototype = new AbstractInstanceRefactoring();

// MLSimplifyProductOperations.prototype.adaptDocument = function(doc){
//   var self = this;
//   setTimeout(function(){self.abstract_refactoring.adaptDocument(doc)},5000);
// };

/**
 * Set target URLs
 */

MLSimplifyProductOperations.prototype.setTargetURLs = function(){
  this.addTargetURL( /http:\/\/articulo.mercadolibre.com.ar/ );
  this.addTargetURL( /http:\/\/casa.mercadolibre.com.ar/ );
};

/**
 * Initialize instantiated refactoring
 */

MLSimplifyProductOperations.prototype.initialize = function( language ){
  this.abstract_refactoring = new SimplifyImportantOperations.SimplifyImportantOperations( "Mercado Libre Product Info" );

  this.abstract_refactoring.setMainElement( "//div/*[contains(concat(' ', @class, ' '), ' infoProd ')]" );

  // like a key/value structure. This is: title, xPath
  this.abstract_refactoring.defineElement( "T\u00EDtulo", "//div/*[contains(concat(' ', @class, ' '), ' infoProd ')]/*[@itemprop='name']" );
  this.abstract_refactoring.defineElement( "Detalles", "//div/*[contains(concat(' ', @class, ' '), ' infoProd ')]/*[contains(concat(' ', @class, ' '), ' subtitle ')]" );

  // returns a key-like value that can be used to reference a container/parent element.
  var forma_de_pago = this.abstract_refactoring.defineOperationContainer( "Forma de Pago" );
  this.abstract_refactoring.addAction( forma_de_pago, "Cuotas", "//menu[@id='installmentsSelect']/li" );
  this.abstract_refactoring.addAction( forma_de_pago, "Tarjetas", null, "http://articulo.mercadolibre.com.ar/paymentMethod/installmentsCombo?item_id=MLA482680863&isExpressBuy=false&x=x&_=1385992523502");

};