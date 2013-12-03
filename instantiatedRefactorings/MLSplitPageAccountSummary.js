var metadata = {"author":"Veronica Murga", "name":"SplitPage para Mercado Libre Datos del usuario logeado", "description":"...","id":"splitPage-mainMercadoLibre-summary-vmurga-"};

function getAccessibilityAugmenter(){
	return new MercadoLibreUserSplitWrapper();
};

function MercadoLibreUserSplitWrapper(){
}

MercadoLibreUserSplitWrapper.prototype = new AbstractInstanceRefactoring();

MercadoLibreUserSplitWrapper.prototype.setTargetURLs = function(){
	this.addTargetURL(/https:\/\/myaccount.mercadolibre.com.ar\/summary/);
	this.addExcludedURL(/www.mercadolibre.com.ar\/jm\/ml.myAccount.facturacion/);
	this.addExcludedURL(/www.mercadolibre.com.ar\/jm\/ml.feedback.app.NewFeedback/);
	this.addExcludedURL(/www.mercadolibre.com.ar\/jm\/myML?as_section=AIMED_IT/);
	this.addExcludedURL(/https:\/\/myaccount.mercadolibre.com.ar\/bookmarks\/list#/);
	this.addExcludedURL(/syi.mercadolibre.com.ar\/sell\/sell[.]*/);
	
	
};

MercadoLibreUserSplitWrapper.prototype.initialize = function(language){

	this.refactoring = new SplitPage.SplitPage("MercadoLibre account summary");

	var volver = new SplitPage.StaticLink("Volver al home", "https://www.mercadolibre.com.ar/");
	this.refactoring.addSplitedSection(volver);
		
	var pagos = new SplitPage.StaticLink("Pagos y facturacion", "http://www.mercadolibre.com.ar/jm/ml.myAccount.facturacion");
	this.refactoring.addSplitedSection(pagos);
	
	
	var reputacion = new SplitPage.StaticLink("Mi reputacion", "http://www.mercadolibre.com.ar/jm/ml.feedback.app.NewFeedback");
	this.refactoring.addSplitedSection(reputacion);
	
	
    var favoritos = new SplitPage.StaticLink("Mis favoritos", "https://myaccount.mercadolibre.com.ar/bookmarks/list#");
	this.refactoring.addSplitedSection(favoritos);

/*	
HAY QUE ELIMINAR LOS LINKS
    var compras = new SplitPage.StaticLink("Compras", "https://questions.mercadolibre.com.ar/buyer#");
	this.refactoring.addSplitedSection(compras);

	var preguntas = new SplitPage.StaticLink("Preguntas", "https://myaccount.mercadolibre.com.ar/purchases/list#");
	this.refactoring.addSplitedSection(preguntas);

	var subastas = new SplitPage.StaticLink("Subastas ofertadas", "www.mercadolibre.com.ar/jm/myML?as_section=BID_AUCT ");
	this.refactoring.addSplitedSection(subastas);
	
	var finalizadas = new SplitPage.StaticLink("Finalizadas (no compradas)", "http://www.mercadolibre.com.ar/jm/myML?as_section=NOT_BGHT");
	this.refactoring.addSplitedSection(finalizadas);	
*/
	var logout = new SplitPage.StaticLink("Salir", "https://www.mercadolibre.com.ar/jm/logout");
	this.refactoring.addSplitedSection(logout);
	
	
	this.abstract_refactoring = this.refactoring;
	

};

MercadoLibreUserSplitWrapper.prototype.initRefactoringForPageLoaded = function(doc,language){


};