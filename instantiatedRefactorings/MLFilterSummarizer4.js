var metadata = {"author":"Murga Veronica", "name":"Summarize for ML", "description":"resumen filtro 4","id":"filterSummarizer-ML-vmurga4"};

function getAccessibilityAugmenter(){
	return new MLFilterSummarizer4();
};

function MLFilterSummarizer4(){	
};
	
MLFilterSummarizer4.prototype = new AbstractInstanceRefactoring();

MLFilterSummarizer4.prototype.setTargetURLs = function(){
	this.addTargetURL(/http:\/\/listado.mercadolibre.com.ar/);
};

MLFilterSummarizer4.prototype.initialize = function(){	
		this.abstract_refactoring = new InformationSummarizerRefactoring.InformationSummarizerRefactoring("Summarize ML Filter 4");											  
		
		this.abstract_refactoring.setOriginalNode("/html/body/div[2]/div[2]/div/dl[7]");
		this.abstract_refactoring.addToSummary("./dt[1]");//xPath relativo al "Original Node"
		this.abstract_refactoring.addToSummary("./dd[1]");

};