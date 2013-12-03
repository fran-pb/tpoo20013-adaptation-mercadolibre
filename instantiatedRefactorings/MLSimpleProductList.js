var metadata = {"author":"Diego Paez, Francisco Peña", "name":"Simple Product List for Mercado Libre", "description":"Simple Product List for Mercado Libre","id":"ML-simplifyList-products-dpaez-fpena"};

function getAccessibilityAugmenter(){
	return new MLSimpleProductList();
};

function MLSimpleProductList(){

};

MLSimpleProductList.prototype = new AbstractInstanceRefactoring();

MLSimpleProductList.prototype.setTargetURLs = function(){
	this.addTargetURL( /http:\/\/listado.mercadolibre.com.ar/ );
};

MLSimpleProductList.prototype.initialize = function( language ){
	this.abstract_refactoring = new SimplifyList.SimplifyList( "Mercado Libre Q&A" );
	this.abstract_refactoring.setTargetElements( "//li[contains(@class, 'list-view-item rowItem')]" );

	var relatives = [
	  {
	    title: 'Titulo',
	    rel_xPath: './h3',
	    ifEmpty: 'Sin Titulo',
	    keepOriginal: true
	  },
	  {
	    title: 'Precio y forma de pago',
	    rel_xPath: './p[contains(@class, "price-info")]',
	    ifEmpty: 'Indefinido',
	    keepOriginal: false
	  },
	  {
	    title: 'Descripcion',
	    rel_xPath: './p[contains(@class, "list-view-item-subtitle")]',
	    ifEmpty: 'Sin Descripcion',
	    keepOriginal: false
	  },
  	{
  	  title: 'Ubicacion',
  	  rel_xPath: './ul',
	    ifEmpty: 'Indefinido',
	    keepOriginal: false
  	}
	];

	this.abstract_refactoring.setRelativeData( relatives );

	this.abstract_refactoring.setElementToAppendResult( "//ol[@id='searchResults']" );
};