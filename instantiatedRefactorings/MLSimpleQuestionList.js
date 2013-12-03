var metadata = {"author":"Diego Paez, Francisco Peña", "name":"Simple Q&A for Mercado Libre", "description":"Simple Q&A for Mercado Libre","id":"ML-simplifyList-qa-dpaez-fpena"};

function getAccessibilityAugmenter(){
	return new MLSimpleQuestionsAnswers();
};

function MLSimpleQuestionsAnswers(){

};

MLSimpleQuestionsAnswers.prototype = new AbstractInstanceRefactoring();

MLSimpleQuestionsAnswers.prototype.setTargetURLs = function(){
	this.addTargetURL( /http:\/\/articulo.mercadolibre.com.ar/ );
};

MLSimpleQuestionsAnswers.prototype.adaptDocument = function(doc){
	var self = this;
	setTimeout(function(){self.abstract_refactoring.adaptDocument(doc)},5000);
};

MLSimpleQuestionsAnswers.prototype.initialize = function( language ){
	this.abstract_refactoring = new SimplifyList.SimplifyList( "Mercado Libre Q&A" );
	this.abstract_refactoring.setTargetElements( "//li[contains(@id, 'Quest')]" );

	var relatives = [
	  {
	    title: 'Pregunta',
	    rel_xPath: './dl/dd[contains(@class, "txt")]/span',
	    ifEmpty: 'Sin Pregunta',
	    keepOriginal: false
	  },
  	{
  	  title: 'Denunciar pregunta',
  	  rel_xPath: './dl/dd[contains(@class, "txt")]/a[@id="denouncequestion"]',
	    ifEmpty: 'Sin denunciar',
	    keepOriginal: true
  	},
	  {
	    title: 'Respuesta',
	    rel_xPath: './dl/dd[contains(@class, "txt answer-txt")]/span',
	    ifEmpty: 'Sin Respuesta',
	    keepOriginal: false
	  },
  	{
  	  title: 'Fecha de respuesta',
  	  rel_xPath: './dl/dd[contains(@class, "txt answer-txt")]/span[contains(@class, "time")]',
	    ifEmpty: 'Sin fecha de respuesta',
	    keepOriginal: false
  	},
  	{
  	  title: 'Denunciar respuesta',
  	  rel_xPath: './dl/dd[contains(@class, "txt answer-txt")]/a[@id="denounceanswer"]',
	    ifEmpty: 'Sin denunciar',
	    keepOriginal: true
  	}
	];

	this.abstract_refactoring.setRelativeData( relatives );

	this.abstract_refactoring.setElementToAppendResult( "//*[@id='questions']" );
};