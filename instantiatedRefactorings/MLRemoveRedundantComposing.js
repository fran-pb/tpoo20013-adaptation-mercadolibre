var metadata = {"author":"Diego Paez", "name":"Remove Redundant for Mercado Libre's Compose", "description":"This refactoring removes the first occurrences of the operations send, save and discard","id":"removeRedundant-mainML-dpaez"};

function getAccessibilityAugmenter(){
	return new MLRemoveRedundantOperations();
};

function MLRemoveRedundantOperations(){

};

MLRemoveRedundantOperations.prototype = new AbstractInstanceRefactoring();

MLRemoveRedundantOperations.prototype.setTargetURLs = function(){
  this.addTargetURL(/http:\/\/articulo.mercadolibre.com.ar\//);
  this.addExcludedURL(/http:\/\/www.mercadolibre.com.ar\/inmuebles\//);
};

MLRemoveRedundantOperations.prototype.initialize = function(language){
		this.abstract_refactoring = new RemoveRedundantOperationRefactoring.RemoveRedundantOperationRefactoring("ML Product Page");
		this.abstract_refactoring.addRedundantOperation("/html/body/div[2]");
};
