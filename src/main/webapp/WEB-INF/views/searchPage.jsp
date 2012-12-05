<%@include file="/WEB-INF/views/includes/taglibs.jsp"%>

    <div class="easyui-layout" style="width:100%;height:950px;">  
        
        <div data-options="region:'north'" style="height:102px">
        <header id="header">
			<h2 id="title"><spring:message code="searchPage.title"/></h2>
			<div>
				<%@include file="/WEB-INF/views/localeChanger.jsp"%>
			</div>	
		</header>
        </div>  
        
        <div data-options="region:'center',iconCls:'icon-ok'">  
            <div class="easyui-layout" data-options="fit:true">  
                <div data-options="region:'north' ,split:true,border:false" style="height:65px">
                	<header class="user-input-zone">
					 	<input  class="user-input movie-title" placeholder="<spring:message code="searchPage.movie.title.placeholder"/>" />
					 	<button class="search-button user-input add"><spring:message code="searchPage.button.add"/></button>
					 </header>                
                </div>  
                <div data-options="region:'west', title:'<spring:message code="searchPage.movie.briefdata"/>',split:true,border:false" style="width:500px">
                 		<div id="accordion" class="search-results easyui-accordion"></div>                  							          				    	  
                </div>  
                
                <div class="detailedMovieData" data-options="region:'center', title:'<spring:message code="searchPage.movie.detaileddata"/>',border:false"></div>  
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
        
        <div data-options="region:'south',split:true" style="height:50px;">
        	<footer class="main"><h5 class="page-footer"><%@include file="/WEB-INF/views/footer.jsp"%></h5></footer>
        </div>          
    </div>  
    
<%-- MovieItemTemplates --%>	
<textarea id="searchItemTmpl" class="ui-helper-hidden"><div id={searchTerm} title={searchTerm} data-options="iconCls:'icon-save'"></div></textarea>
<textarea id="movieDataSourceTmpl" class="ui-helper-hidden"><ul class="easyui-tree"><li><span>{site}</span><ul id={site}></ul></li></ul></textarea>
<textarea id="movieItemTmpl" class="ui-helper-hidden"><li><span>{title}</span><ul><li>{year}</li><li>{director}</li><li><a class="movie-id" href="#" id={id}>{id}</a></li></ul></li></textarea>
<%--Messages Component--%>
<input type="hidden" class="messages"
data-search-url='${pageContext.request.contextPath}/searchMovies/'
data-searchPage.no.infosource.selected='<spring:message code="searchPage.no.infosource.selected"/>'
data-searchpage.movie.required='<spring:message code="searchPage.movie.required"/>'
data-searchPage.server.error='<spring:message code="searchPage.server.error"/>'
>