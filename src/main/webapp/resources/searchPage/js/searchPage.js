(function($, NS, SuperClass, SubClass) {
	window[NS][SubClass] = window[NS][SubClass] || window[NS][SuperClass].extend({
		toString : function() {
			return NS + '.' + SubClass;
		},
		$ctx: $('#searchPage'),
		$msg: $('#searchPage .messages'),
		$contentArea:$('.search-results','#searchPage'),
		$accordion : null,
		$addButton : $("button.add",'#searchPage'),
		$searchTerm : $("input.movie-title",'#searchPage'),
		request: null,
		socket: $.atmosphere,
		subSocket: null,
		/*Test socket*/
		requestTest: null,
		socketTest: $.atmosphere,
		subSocketTest: null,
		isSending:false,
		stopSignaled:false,
		
		fruits:['apple','pear','plum','nut','coconut','pineapple','grapes','cherry','strawberry','banana','grapefruit','chestnut','walnut','peanut'],
		/** Constructor. */
		init : function(cfg) {
			//this.doLayout();
			this.openChannel("streaming");
			//this.openChannelTest("streaming");
			this.bindBehavior();
			this.request.onMessage = $.proxy(this.messageReceived,this);
		},
		
		/**Renders the page's dynamic layout*/
		doLayout : function(e) {
			var cfgLayout = {
				spacing_open:3,
				spacing_closed:3,
				north : {
					resizable : false,
					closable : true
				},
				south : {
					resizable : false,
					closable : false
				}
			};
			this.$ctx.layout(cfgLayout);
			$('#header').layout($.extend({},cfgLayout,{
				east:{
					size:20 + $('span.locale-changer').width()
				}
			}));
			$('.layout-inner').layout($.extend({},cfgLayout,{
				east:{
					size:0.66
				}
			}));
			$('.user-input-zone').layout(cfgLayout);
		},
		/**For Test Purposes only*/
		bindTestBehavior: function(){
			var that=this;
			
			$('#btnSend').click(function(){
				var v=$('#txtFromClient').val();
				if(jQuery.atmosphere.requests.length===0){
					that.openChannelTest("streaming");
				}
				that.requestTest.method='POST';
				that.subSocketTest.push(v);
			});
			$('#btnAutoSend').click(function(){
				var lngTimer,t= 20, sender=function(){
					var v=that.fruits.choose();
					that.requestTest.method='POST';
					that.subSocketTest.push(v);
					
					window.clearTimeout(lngTimer);
					t= Number.random(1000,6000);
					if(!that.stopSignaled){
						lngTimer=window.setTimeout(sender,t);
					}
				};
				if(jQuery.atmosphere.requests.length===0){
					that.openChannelTest("streaming");
				}
				
				that.isSending=true;
				$('#btnAutoSend').attr('disabled','disabled');
				$('#btnStop').removeAttr('disabled');
				
				window.clearTimeout(lngTimer);
				lngTimer=window.setTimeout(sender,t);
			});
			$('#btnStop').click(function(){
				that.stopSignaled=true;
				that.isSending=false;
				that.socketTest.unsubscribe();
				that.isSending=true;
				$('#btnAutoSend').removeAttr('disabled','disabled');
				$('#btnStop').attr('disabled','disabled');
				
			});
		},
		bindBehavior: function(){
			var that=this;
			//this.bindTestBehavior();
			//bind search page Behavior:
			this.$addButton.on('click', $.proxy(this.processRequest, this));
			this.$accordion=this.$contentArea.accordion({heightStyle: "content", collapsible: true, active: false});			
		},
		/**Open a bi-directional communication channel between the browser and the specified server.*/
		openChannel: function (transport,connectionType) {
			var that=this;
				
			this.request = new $.atmosphere.AtmosphereRequest();
			$.extend(this.request,{
				url:that.$ctx.data('search-url'),
				contentType:"application/json",
				transport:transport,
				fallbackTransport:"long-polling",
				onOpen:that.onChannelOpen,	
				onMessage:that.onMessageReceived,
				onMessagePublished: that.onMessagePublished,
				onError:that.onError,
				onReconnect: that.onReconnect
			});
			this.subSocket = this.socket.subscribe(this.request);
		},
		
		openChannelTest: function (transport,connectionType) {
			var that=this;
			
			this.requestTest = new $.atmosphere.AtmosphereRequest();
			$.extend(this.requestTest,{
				url:that.$ctx.data('test-url'),
				contentType:"application/json",
				transport:transport,
				fallbackTransport:"long-polling",
				onOpen:that.onChannelOpen,	
				onMessage:that.onMessageReceived,
				onMessagePublished: that.onMessagePublished,
				onError:that.onError,
				onReconnect: that.onReconnect
			});
			this.subSocketTest = this.socketTest.subscribe(this.requestTest);
		},
		
		/**On Channel open*/
		onChannelOpen: function(){
			$.atmosphere.log('info', ['onChannelOpen']);
		},
		
		/**On Message From server.*/
		onMessageReceived: function(response){			
			var contentArea = $('.search-results',this.$ctx),
        	searchItemTmpl = $('#searchItemTmpl').val(),		        
			movieDataSourceTmpl = $('#movieDataSourceTmpl').val(),
			movieItemTmpl = $('#movieItemTmpl').val(),
			movieTitle = $('.movie-title',this.$ctx).val(), 
			briefMovieInfo = null,
			site = null,
			that=this;						
			
			$.atmosphere.log('info', ['onMessageReceived']);			

			if(response.state === "messageReceived"){	            	
	        	if(response.responseBody!==""){
	        		
	        		$('#accordion').accordion('add', {
	    				title: movieTitle,
	    				content: $(searchItemTmpl.tmpl({
	    							"searchTerm" : movieTitle						
	    						})),
	    				selected: true
	    			});		  
	        		
	        		briefMovieInfo = $.parseJSON(response.responseBody);	           			        		
	        		
	        		if(briefMovieInfo[0].site){
	        			$(movieDataSourceTmpl.tmpl({
							"site" : briefMovieInfo[0].site						
						})).appendTo($('#accordion').accordion('getPanel',movieTitle));	
	        		}
	        		
		        	$.each(briefMovieInfo,function(index, value){
		        		$(movieItemTmpl.tmpl({
							"title" : value.title,
							"year" : value.year,
							"director" : value.director,
							"id" : value.id
						})).appendTo($('#accordion').accordion('getPanel',movieTitle).find('#'+value.site));
		        		site = value.site;
	        		});
		        	$('#accordion').accordion('getPanel',movieTitle).find('#'+site).tree({animate:true});			        		        		
	        		
	        		$('.movie-id').on('click',function(e){
	        			$.proxy(that.getDetailedData, that);
					});    				
	        		
	        	}else{ //the response is empty
	        		$.atmosphere.log('info', ["empty response"]);
	            }
		    }// end if(response.state==="messageReceived")	    
		},
		
		/**On Message Published*/
		onMessagePublished: function(response){
			$.atmosphere.log('info', ['onMessagePublished.', response]);
		},
		
		/**On Channel Error*/
		onError: function(){
			$.atmosphere.log('info', ['onError']);
		},
		/**On Channel Reconnected*/
		onReconnect: function(){
			$.atmosphere.log('info', ['onReconnect']);
		},
		
		/**Sends a request to server and then*/
		processRequest: function(e){
			var that= this,
			$el = $(e.target), 
			movieData = {
			"searchTerms" : [],
			"infoSourceKeys" : []
			}, 
			movieTitle = $('.movie-title',this.$ctx).val(), 
			contentArea = $('.search-results',this.$ctx), 
			searchItemTmpl = $('#searchItemTmpl').val();						
	
			// map all the checked checkboxes' values into an array
			movieData.infoSourceKeys = $('.info-sources :checked',this.$ctx).map(function() {
				return this.value;
			}).get();
			// put the search term into the movieData object
			if($('.movie-title').val()!==""){
				movieData.searchTerms.push($('.movie-title').val());	
			}		
			
			$.atmosphere.log('info', [movieData]);
	
			if (movieData.infoSourceKeys.length === 0) {
				$().message(this.$msg.data('searchpage.no.infosource.selected'),true);
				return false;
			}
			if (movieData.searchTerms.length === 0) {
				$().message(this.$msg.data('searchpage.movie.required'),true);
				return false;
			}
			this.request.method='POST';
			this.request.url=this.$ctx.data('search-url');
			
			/*$('#accordion').accordion('add', {
				title: movieTitle,
				content: $(searchItemTmpl.tmpl({
							"searchTerm" : movieTitle						
						})),
				selected: false
			});		  */      	
        	this.subSocket.push(JSON.stringify(movieData));		    
        	
        	
		},
				
	});

	/* Attach page specific behavior on page load */
	$(function() {
		return new window[NS][SubClass]();
	});
}(window.jQuery, "WMC", "Base", "SearchPage"));
