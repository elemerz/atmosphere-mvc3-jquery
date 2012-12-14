<%@include file="/WEB-INF/views/includes/taglibs.jsp"%>

    <div class="easyui-layout" style="width:100%;height:950px;">  
        
        <div data-options="region:'north'" style="height:102px">
        <header id="header">
        <div class="header">
			<h2 id="title"><spring:message code="searchPage.title"/></h2>
			<div id="locale-changer" class="meta-menu">
				<%@include file="/WEB-INF/views/localeChanger.jsp"%>
			</div>	
			<div class="meta-menu">
				<div class="layout-state"">  
			        <a href="#" class="easyui-splitbutton" data-options="menu:'#mm1',iconCls:'icon-ok'">${currentTemplate}</a>  
			    </div>
			    <div id="mm1" style="width:150px;">
			    	<div data-options="iconCls:'icon-edit'" class="basic-template" onclick="<c:set var='currentTemplate' value='Basic Template' />">
			    		Basic Template
			    	</div>  
			        <div data-options="iconCls:'icon-edit'" class="ez-template" onclick="<c:set var='currentTemplate' value='EZ Studios Template' />">									    	
			        	EZ Studios Template
			        </div>  
			    </div>  
			</div>
		</div>
		</header>
        </div>  
        
        <div data-options="region:'center',iconCls:'icon-ok'">  
            <div class="easyui-layout" data-options="fit:true">  
                <div data-options="region:'north' ,split:true,border:false" style="height:65px">
                	<header class="user-input-zone">
					 	<button class="search-button user-input add"><spring:message code="searchPage.button.add"/></button>               	
					 	<input  class="user-input movie-title" placeholder="<spring:message code="searchPage.movie.title.placeholder"/>" />
					 </header>                
                </div>  
                <div data-options="region:'west', title:'<spring:message code="searchPage.movie.briefdata"/>',split:true,border:false" style="width:500px">
                 		<div id="accordion" class="search-results easyui-accordion"></div>                  							          				    	  
                </div>  
                
                <div class="detailedMovieData" data-options="region:'center', title:'<spring:message code="searchPage.movie.detaileddata"/>',border:false" style="height:665px">
                	<div id="tabs" style="height:665px;" class="easyui-tabs display-none"></div>
                </div>  
                <div data-options="region:'south',split:true,border:false" style="height:50px">
                	<ul class="info-sources">
						<c:forEach var="infoSource" items="${infoSources}" varStatus="status">
							<c:if test="${status.first}">
								<li class="info-source"><input type="checkbox" checked="checked" id="${infoSource}" value="${infoSource}" /><label for="${infoSource}">${infoSource}</label></li>
							</c:if>
							<c:if test="${not status.first}">
								<li class="info-source"><input type="checkbox" id="${infoSource}" value="${infoSource}" /><label for="${infoSource}">${infoSource}</label></li>
							</c:if>
						</c:forEach>
				 	</ul>
                </div>
            </div>  
        </div>  <%--end tag for center region layout --%>
        
        <div data-options="region:'south',split:true" style="height:40px;">
        	<footer class="main"><h5 class="page-footer"><%@include file="/WEB-INF/views/footer.jsp"%></h5></footer>
        </div>          
    </div>  
    
<%-- MovieItemTemplates --%>	
<textarea id="searchItemTmpl" class="ui-helper-hidden"><div id={searchTerm} title={searchTerm}></div></textarea>
<textarea id="movieDataSourceTmpl" class="ui-helper-hidden"><ul class="easyui-tree"><li><span>{site}</span><ul class={site}></ul></li></ul></textarea>
<textarea id="movieItemTmpl" class="ui-helper-hidden"><li><span>{title}</span><ul><li>{year}</li><li>{director}</li><li><a class="movie-id" href="#" id={id} title={id} data-site={site}><spring:message code="searchPage.movie.detaileddata"/></a></li></ul></li></textarea>
<textarea id="detailedMovieItemTmpl" class="ui-helper-hidden">
			<ul>
				<li><span><spring:message code="searchPage.movie.description"/></span><ul><li>{description}</li></ul></li>
				<li><span><spring:message code="searchPage.movie.cast"/></span><ul><li>{cast}</li></ul></li>
				<li><span><spring:message code="searchPage.movie.genre"/></span><ul><li>{genre}</li></ul></li>
				<li><span><spring:message code="searchPage.movie.rate"/></span><ul><li>{rate}</li></ul></li>
				<li><span><spring:message code="searchPage.movie.runtime"/></span><ul><li>{runtime}</li></ul></li>				
			</ul>
</textarea>
<%--Messages Component--%>
<input type="hidden" class="messages"
data-search-url='${pageContext.request.contextPath}/searchMovies/' 
data-detailedSearch-url='${pageContext.request.contextPath}/searchDetailedData/' 
data-searchPage.no.infosource.selected='<spring:message code="searchPage.no.infosource.selected"/>'
data-searchpage.movie.required='<spring:message code="searchPage.movie.required"/>'
data-searchPage.server.error='<spring:message code="searchPage.server.error"/>'
>
