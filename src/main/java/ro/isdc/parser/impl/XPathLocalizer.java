package ro.isdc.parser.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.htmlcleaner.CleanerProperties;
import org.htmlcleaner.HtmlCleaner;
import org.htmlcleaner.SimpleHtmlSerializer;
import org.htmlcleaner.TagNode;
import org.htmlcleaner.XPatherException;

import ro.isdc.model.HtmlNodePathMapper;
import ro.isdc.model.MovieInfo;
import ro.isdc.model.SimpleMovieInfo;

/**.
 * XPath parser implementation
 * 
 * @author felix.cosma
 *
 */
public class XPathLocalizer  implements ElementLocalizer {
	
	ArrayList<SimpleMovieInfo> moviesResults = new ArrayList<SimpleMovieInfo>();
	SimpleHtmlSerializer htmlSerializer = null;	

	/**
	 * Retrieve the list of simple movie results 
	 * 
	 *  parsed in such a way that we have a maximum of 10 entries - no duplicates
	 * 
	 */
	@Override
	public List<SimpleMovieInfo> getMoviesByTitle(String htmlContent, String websiteId, HtmlNodePathMapper htmlNodePathMapper) {
		
		Map<String, SimpleMovieInfo> movieResultsMap = new HashMap<String, SimpleMovieInfo>();
		
	    try {
	    	String listXpath = htmlNodePathMapper.getNodePathMap().get(websiteId + ".list");
	    	Object[] listOfMovies = cleanWithHtmlCleaner(htmlContent, websiteId, listXpath);
			for (Object listItem : listOfMovies) {
				SimpleMovieInfo movieItem = new SimpleMovieInfo();
				String title = getXpathElement(((TagNode) listItem), htmlNodePathMapper.getNodePathMap().get(websiteId + ".title"));
				String year = getXpathElement(((TagNode) listItem), htmlNodePathMapper.getNodePathMap().get(websiteId + ".year"));
				String director = getXpathElement(((TagNode) listItem), htmlNodePathMapper.getNodePathMap().get(websiteId + ".director"));
				String id = getXpathElement(((TagNode) listItem), htmlNodePathMapper.getNodePathMap().get(websiteId + ".id"));

				if(title != null) {
					movieItem.setTitle(title);
					movieItem.setYear(year);
					movieItem.setDirector(director);
					movieItem.setId(id);
					movieItem.setSite(websiteId);
					movieResultsMap.put(title+year, movieItem);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	    
	    Iterator<String> it = movieResultsMap.keySet().iterator();
	    int counter = 0;
		while(it.hasNext() && counter < 9) {
			moviesResults.add(movieResultsMap.get(it.next()));
			counter++;
		}
	    
		return moviesResults;
	}

	@Override
	public MovieInfo getMovieDetails(String htmlContent, String websiteId, HtmlNodePathMapper htmlNodePathMapper) {
	
		MovieInfo movieItem = new MovieInfo();
		 		
	    try {
	    	String listXpath = htmlNodePathMapper.getNodePathMap().get(websiteId + ".root");
	    	Object[] listOfMovies = cleanWithHtmlCleaner(htmlContent, websiteId, listXpath);
	    	TagNode listItem = (TagNode) listOfMovies[0];
	    	
			String rate = getXpathElement(listItem, htmlNodePathMapper.getNodePathMap().get(websiteId + ".rate"));
			String description = getXpathElement(listItem, htmlNodePathMapper.getNodePathMap().get(websiteId + ".description"));
			String cast = getXpathElement(listItem, htmlNodePathMapper.getNodePathMap().get(websiteId + ".cast"));
			String genre = getXpathElement(listItem, htmlNodePathMapper.getNodePathMap().get(websiteId + ".genre"));
			String runtime = getXpathElement(listItem, htmlNodePathMapper.getNodePathMap().get(websiteId + ".runtime"));

			movieItem.setRate(rate);
			movieItem.setDescription(description);
			movieItem.setCast(cast);
			movieItem.setGenre(genre);
			movieItem.setRuntime(runtime);		
		
		} catch (Exception e) {
			e.printStackTrace();
		}		
		return movieItem;
	}
	
	/**
	 * Use htmlCleaner as a parser
	 * 
	 * @param htmContent
	 * @return
	 */
	public Object[] cleanWithHtmlCleaner(String htmContent, String website, String listXpath) throws Exception{
			 
			        HtmlCleaner cleaner = new HtmlCleaner();
			        CleanerProperties props = cleaner.getProperties();
			        props.setAllowHtmlInsideAttributes(true);
			        props.setAllowMultiWordAttributes(true);
			        props.setRecognizeUnicodeChars(true);
			        props.setOmitComments(true);
			 
			        TagNode node = cleaner.clean(htmContent);
			        htmlSerializer = new SimpleHtmlSerializer(props);
			        Object[] resultsList = node.evaluateXPath(listXpath);
			        
			        return resultsList;
	}
	
	/**
	 * Retrieve element string using xpath
	 * 
	 * @param movieItem
	 * @param movieXpath
	 * @return
	 * @throws XPatherException
	 */
	public String getXpathElement(TagNode movieItem, String movieXpath) throws XPatherException {
		
		Object[] listOfItems = movieItem.evaluateXPath(movieXpath);
		TagNode xpathItemNode = null;
		String xpathItemString = null;

		if (listOfItems.length > 0) {
			try {
				xpathItemNode = (TagNode) listOfItems[0];
			} catch(Exception e) {
				xpathItemString = listOfItems[0].toString();
			}
			return xpathItemNode != null ? xpathItemNode.getText().toString() : xpathItemString;
		}
		return null;
	}	
}