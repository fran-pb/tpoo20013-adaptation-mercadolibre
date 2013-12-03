var metadata = {"author":"Murga Veronica", "name":"Summarize for ML", "description":"resumen filtro 3","id":"filterSummarizer-ML-vmurga3"};

function getAccessibilityAugmenter(){
	return new MLFilterSummarizer3();
};

function MLFilterSummarizer3(){	
};
	
MLFilterSummarizer3.prototype = new AbstractInstanceRefactoring();

MLFilterSummarizer3.prototype.setTargetURLs = function(){
	this.addTargetURL(/http:\/\/listado.mercadolibre.com.ar/);
};

MLFilterSummarizer3.prototype.initialize = function(){	
		this.abstract_refactoring = new InformationSummarizerRefactoring.InformationSummarizerRefactoring("Summarize ML Filter 3");											  
		
		this.abstract_refactoring.setOriginalNode("/html/body/div[2]/div[2]/div/dl[5]");
		this.abstract_refactoring.addToSummary("./dt[1]");//xPath relativo al "Original Node"
		this.abstract_refactoring.addToSummary("./dd[1]");

};
