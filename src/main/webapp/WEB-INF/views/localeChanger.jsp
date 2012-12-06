<%@include file="/WEB-INF/views/includes/taglibs.jsp"%>
<span class="locale-changer">
	<div>
	    <%-- 
	    <div>
	        <button id="rerun"><label class="switch-to"><spring:message code="localeChanger.language"/></label> Lng</button>
	        <button id="select">Select an action</button>
	    </div>
	    <select>
	    </select>
	    --%>
		<div class="layout-state">  
	        <a href="#" class="easyui-splitbutton" data-options="menu:'#mm2',iconCls:'locale ${currentLanguage}'"><span style="padding-left:10px;"><spring:message code="localeChanger.${currentLanguage}"/></span></a>  
	    </div>	    
	    <div id="mm2" style="width:110px;">        
		    <c:forEach var="lng" items="${supportedLanguages}" varStatus="status">
<%-- 	        	<c:if test="${currentLanguage eq lng}"> --%>
   			    	<div data-options="iconCls:'locale ${lng}'">
   			    		<a href="?lang=${lng}">
   			    			<spring:message code="localeChanger.${lng}"/>
   			    		</a>
   			    	</div>          	
<%-- 		        	<label class="locale ${lng} current-lng"><spring:message code="localeChanger.${lng}"/></label> --%>
<%-- 	        	</c:if> --%>
<%-- 	        	<c:if test="${currentLanguage ne lng}"> --%>
<%-- 		        	<a class="locale ${lng}" href="?lang=${lng}"><spring:message code="localeChanger.${lng}"/></a> --%>
<%-- 	        	</c:if> --%>
		    </c:forEach>
	    </div>  
	</div>
</span>