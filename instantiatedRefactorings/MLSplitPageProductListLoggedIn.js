var metadata = {"author":"Veronica Murga ", "name":"SplitPage para Mercado Libre Listado productos usuario logeado", "description":"...","id":"splitPage-ProductlistMercadoLibreUserLoggedIn-vmurga"};

function getAccessibilityAugmenter(){
	return new MercadoLibreListProductSplitWrapperLoggedIn();
};

function MercadoLibreListProductSplitWrapperLoggedIn(){
	this.logeado = true;
}

MercadoLibreListProductSplitWrapperLoggedIn.prototype = new AbstractInstanceRefactoring();

MercadoLibreListProductSplitWrapperLoggedIn.prototype.setTargetURLs = function(){
	this.addExcludedURL(/www.mercadolibre.com.ar\/[a-z|A-Z|a-z-0-9|A-Z-0-9]*/);
	this.addTargetURL(/[a-zA-Z]*.mercadolibre.com.ar\/[a-z|A-Z|a-z-0-9|A-Z-0-9]*/);
	this.addExcludedURL(/http:\/\/www.mercadolibre.com.ar\/inmuebles\//);
	this.addExcludedURL(/www.mercadolibre.com.ar\/jm\/ml.myAccount.facturacion/);
	this.addExcludedURL(/www.mercadolibre.com.ar\/jm\/ml.feedback.app.NewFeedback/);
	this.addExcludedURL(/www.mercadolibre.com.ar\/jm\/myML?as_section=AIMED_IT/);
	this.addExcludedURL(/https:\/\/myaccount.mercadolibre.com.ar\/bookmarks\/list#/);
	this.addExcludedURL(/syi.mercadolibre.com.ar\/sell\/sell[.]*/);
	this.addExcludedURL(/https:\/\/myaccount.mercadolibre.com.ar\/summary/);

};

function checkLogin(nombre, doc) {
	var lista = doc.cookie.split(";");
	var valor = undefined;
	var micookie = undefined;
	var log = false;
	
	for (i in lista) {
		var busca = lista[i].search(nombre);
		if (busca > -1) { micookie=lista[i] }
	}
	if (typeof micookie != 'undefined'){
		var igual = micookie.indexOf("=");
		valor = micookie.substring(igual+1);
		if (valor == 0)
			log = false;
		else
			log = true;
	} else
		log = false;
	return log;
}

MercadoLibreListProductSplitWrapperLoggedIn.prototype.adaptDocument = function(doc){
	this.logeado = checkLogin('orgnickp', doc);
	if (this.logeado){
      this.abstract_refactoring.adaptDocument(doc);
	}
};


MercadoLibreListProductSplitWrapperLoggedIn.prototype.initialize = function(language){

	this.refactoring = new SplitPage.SplitPage("MercadoLibre product list");
	
	var resultado = new SplitPage.SplitedSection('Resultado',this.refactoring);		
	//--------------*** Formulario de busqueda ***** ------ //

	resultado.addElement("/html/body/header/div/a/h1");
	resultado.addElement("//*[@id='formSearch']");
	resultado.addElement("//html/body/header/div/nav/ul");
	resultado.addElementForRemoving("//*[@id='account']");
	resultado.addElementForRemoving("//*[@id='notification']");
	resultado.addElementForRemoving("//*[@id='favorite']");
	resultado.addElementForRemoving("//*[@id='sellBtn']");
	resultado.addElementForRemoving("/html/body/header/div/nav/ul/li[7]");
	
	//--------------*** vista de la lista de productos  ***** ------ //
	
	resultado.addElement('/html/body/div[2]');//xPath del div contenedor 
	resultado.addElement('//*[@id="searchResults"]'); // xPath del listado de producto
	resultado.addElement('/html/body/div[3]/div[3]/div[3]/ul'); //xPath del listado de paginas
	resultado.addElementForRemoving('//*[@id="verticalAds"]'); // xPath del "MercadoClics" abajo del filtro
	resultado.addElementForRemoving('//*[@id="mclicsRow"]'); // xPath del "MercadoClics" arriba del listado de menu
	resultado.addElementForRemoving('//*[@id="mclicsBottom"]');// xPath del "MercadoClics" inferior
	resultado.addElementForRemoving('//*[contains(@class,"related-searches")]'); // xPath de las "busquedas relacionadas". Parte superar del listado
	resultado.addElementForRemoving('//*[contains(@class,"view ")]'); // xPath para eliminar opcion de listado/galeria
	resultado.addElementForRemoving('//*[@id="sortFilter"]'); //xPath que remueve la opcion "relevantes"
	resultado.addElementForRemoving('//*/a/img'); // xPath para remover las imagenes de cada producto
	//--------------*** vista de un producto en particular ***** ------ //

	resultado.addElement('/html/body/div[4]');//xPath  general (main) del producto
	resultado.addElement('//*[@id="tabNavigator"]'); // xPath del navegador que posee la descripcon del producto
	resultado.addElement('/html/body/span/div'); //xPath de producto
	resultado.addElement('/html/body/div[2]/span/div/div[2]'); //xPath vista del detalle del producto
	resultado.addElement('//*[@id="questions"]'); // xPath de lista de preguntas
	resultado.addElementForRemoving('//*[@id="galleryCollection"]'); //xPath de la galeria de fotos
	resultado.addElementForRemoving('/html/body/div[4]'); //xPath progaganda

	var volver = new SplitPage.StaticLink("Volver al home", "https://www.mercadolibre.com.ar/");
	this.refactoring.addSplitedSection(volver);
	
	var logout = new SplitPage.StaticLink("Salir", "https://www.mercadolibre.com.ar/jm/logout");
	this.refactoring.addSplitedSection(logout);
	
	var miCuenta = new SplitPage.StaticLink("Mi cuenta", "https://www.mercadolibre.com.ar/jm/myML");
	this.refactoring.addSplitedSection(miCuenta);
	
    var sell = new SplitPage.StaticLink("Vender", "https://syi.mercadolibre.com.ar/sell");
	this.refactoring.addSplitedSection(sell);
	
	resultado.addStaticLink(volver);
	resultado.addStaticLink(logout);
	resultado.addStaticLink(miCuenta);
	resultado.addStaticLink(sell);

	
	this.refactoring.addSplitedSection(resultado);
	this.refactoring.setAsMain(resultado);
    this.refactoring.setAsFirstSplitedSection();

	this.abstract_refactoring = this.refactoring;

};

MercadoLibreListProductSplitWrapperLoggedIn.prototype.initRefactoringForPageLoaded = function(doc,language){
 	var url_actual = doc.location.toString();
	var match = url_actual.match(/_DisplayType_LF/);
	var listado = url_actual.match(/listado./);
	
	
    if( match == null && listado != null)
	 doc.location.replace(url_actual + '_DisplayType_LF');
};