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
			this.doLayout();
			this.openChannel("streaming");
			this.openChannelTest("streaming");
			this.bindBehavior();
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
			this.bindTestBehavior();
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
			$.atmosphere.log('info', ['onMessageReceived']);
			var v=$('#txaFromServer').val();
			$('#txaFromServer').val(v + (/^\s*$/.test(v) ? '' : '\n') + response.responseBody).scrollTop(100000);
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

        	this.subSocket.push(JSON.stringify(movieData));		       
		}
	});

	/* Attach page specific behavior on page load */
	$(function() {
		return new window[NS][SubClass]();
	});
}(window.jQuery, "WMC", "Base", "SearchPage"));
