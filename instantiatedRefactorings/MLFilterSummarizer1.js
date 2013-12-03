var metadata = {"author":"Murga Veronica", "name":"Summarize for ML", "description":"resumen filtro 1","id":"filterSummarizer-ML-sfirmenich"};

function getAccessibilityAugmenter(){
	return new MLFilterSummarizer();
};

function MLFilterSummarizer(){	
};
	
MLFilterSummarizer.prototype = new AbstractInstanceRefactoring();

MLFilterSummarizer.prototype.setTargetURLs = function(){
	this.addTargetURL(/http:\/\/listado.mercadolibre.com.ar/);
};

MLFilterSummarizer.prototype.initialize = function(){	
		this.abstract_refactoring = new InformationSummarizerRefactoring.InformationSummarizerRefactoring("Summarize ML Filter");											  
		
		this.abstract_refactoring.setOriginalNode("/html/body/div[2]/div[2]/div/dl");
		this.abstract_refactoring.addToSummary("./dt[1]");//xPath relativo al "Original Node"
		this.abstract_refactoring.addToSummary("./dd[1]");

};