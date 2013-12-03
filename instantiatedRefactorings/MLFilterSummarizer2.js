var metadata = {"author":"Murga Veronica", "name":"Summarize for ML", "description":"resumen filtro 2","id":"filterSummarizer-ML-vmurga2"};

function getAccessibilityAugmenter(){
	return new MLFilterSummarizer2();
};

function MLFilterSummarizer2(){	
};
	
MLFilterSummarizer2.prototype = new AbstractInstanceRefactoring();

MLFilterSummarizer2.prototype.setTargetURLs = function(){
	this.addTargetURL(/http:\/\/listado.mercadolibre.com.ar/);
};

MLFilterSummarizer2.prototype.initialize = function(){	
		this.abstract_refactoring = new InformationSummarizerRefactoring.InformationSummarizerRefactoring("Summarize ML Filter 2");											  
		
		this.abstract_refactoring.setOriginalNode("/html/body/div[2]/div[2]/div/dl[3]");
		this.abstract_refactoring.addToSummary("./dt[1]");//xPath relativo al "Original Node"
		this.abstract_refactoring.addToSummary("./dd[1]");

};
