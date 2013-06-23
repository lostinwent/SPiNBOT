/*
 *	speedo.popup.js
 *
 *	Speedo Popup v2.0.1
 *
 *	Speedo Popup is a lightweight jQuery plugin
 *	with powerful customization settings.
 *
 *	http://www.artflow.ro
 *	http://www.agapastudio.com
 *
 *	Copyright (c) 2012-2013 By Artflow & Agapa Studio.All rights reserved.
 */

(function ($, window)
{
	/*
	 *	speedo - Create main core.
	 */
	var speedo = function ()
	{
		return new speedo.fn.init();
	};

	speedo.fn = speedo.prototype = 
	{
		version: '1.0.1',
		constructor: speedo,
		init: function ()
		{
			return this;
		}
	};

	// Prepare for later instantiation.
	speedo.fn.init.prototype = speedo.fn;

	// Make speedo global.
	window.speedo = speedo;

})(jQuery, window);

(function ($, speedo)
{

	/*
	 *	browser() - Handle browser detection.
	 */
	speedo.fn.browser = (function ()
	{
		var object = {};
		var browsers = ['opera', 'chrome', 'safari', 'firefox'];

		object.is_ie = (function ()
		{
			var virtual_div = document.createElement('div');
		
			virtual_div.innerHTML = '<!--[if IE]><i></i><![endif]-->';

			return (virtual_div.getElementsByTagName('i')[0] != null);
		})();

		// Add other browsers values.
		for (key in browsers)
		{
			var user_agent = navigator.userAgent;
			var matches = user_agent.match(new RegExp(browsers[key], 'i'));

			object['is_' + browsers[key]] = (matches !== null);
		}

		if (object.is_ie)
		{
			var ver = 3;
			var div = document.createElement('div');
			var all = div.getElementsByTagName('i')

			while (div.innerHTML = '<!--[if gt IE ' + (++ver) + ']><i></i><![endif]-->', all[0])
				;		// We don't want to do anything.

			object.version = new String(ver > 4 ? ver : 0);
			object.version.high = object.version;
		}
		else
		{
			var app_name = navigator.appName;
			var user_agent = navigator.userAgent;

			var matches = user_agent.match(/(opera|chrome|safari|firefox)\/?\s*(\.?\d+(\.\d+)*)/i);

			var temp;

			if (matches && (temp = user_agent.match(/version\/([\.\d]+)/i)) != null)
			{
				matches[2] = temp[1];
			}

			matches = (matches) ? matches[2] : navigator.appVersion;

			object.version = new String(matches);
			object.version.high = parseInt(object.version);
		}

		return object;
	})();

})(jQuery, speedo);

(function ($, speedo)
{
	/*
	 *	speedo.utility - Utility functions.
	 */
	speedo.fn.utility = (function ()
	{
		var self = {};

		/*
		 *	set_cookie() - Create and set Cookie.
		 *
		 *	PARAMETERS:
		 *		name		- Specifies the cookie name.
		 *		value		- Specifies the cookie value.
		 *		expireDays	- Specifies the expiration date of the cookie in days.
		 */
		self.set_cookie = function (name, value, expire_days)
		{
			var date = new Date();

			date.setDate(date.getDate() + expire_days);

			var value = escape(value) + ((expire_days == null) ? '' : '; expires='+date.toUTCString());

			document.cookie = name + '=' + value;
		}

		/*
		 *	get_cookie() - Get a specific cookie by name.
		 *
		 *	PARAMETERS:
		 *		name	- The name of the cookie.
		 *
		 *	RETURN VLAUE:
		 *		If the cookie has been found, the function returns the value of the cookie.
		 *		If the cookie was not found, the function returns NULL.
		 */
		self.get_cookie = function (name)
		{
			var cookies = document.cookie.split(';');
			var cookie_name = '';
			var cookie_value = '';
			var cookie = [];

			for (var i = 0; i < cookies.length; i++)
			{
				cookie = cookies[i].split('=');

				cookie_name = cookie[0].replace(/^\s+|\s+$/g, ""); 
				cookie_value = cookie[1];

				if (cookie_name == name)
				{
					return unescape(cookie_value);
				}
			}

			return null;
		}

		/*
		 *	query_parameter() - Read query url values.
		 *
		 *	PARAMETERS:
		 *		query	- The url from wich to read the code.
		 *
		 *	RETURN VALUE:
		 *		If the function succeds the return value is the query parametes as an object with name and value,
		 *		otherwise the return value is an empty object.
		 */
		self.query_parameters = function (query)
		{
			var query = query.split("+").join(" ");

			query = query.split('?')[1];

			var params = {};
			var regex = /[?&]?([^=]+)=([^&]*)/g;
			var tokens;

			while (tokens = regex.exec(query))
			{
				params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
			}

			return params;
		};

		/*
		 *	same_domain() - Check if the urls are from the same domain.
		 *
		 *	PARAMETERS:
		 *		url_a	- First url.
		 *		url_b	- Second url.
		 *
		 *	RETURN VALUE:
		 *		If the url is from the same domain, the return value is true, otherwise is false.
		 */
		self.same_domain = function (url_a, url_b)
		{
			var match_a = url_a.match(/^(https?:\/\/)?([\da-z\.-]+)\/?/);
			var match_b = url_b.match(/^(https?:\/\/)?([\da-z\.-]+)\/?/);

			alert(match_b);

			if (match_a[3] == undefined || match_b[3] == undefined)
			{
				return false;
			}

			return (match_a[3].toLower() == match_b[3].toLower())
		};

		return self;

	})();

})(jQuery, speedo);

(function ($, speedo)
{
	/*
	 *	popup - Create main popup core.
	 */
	var popup = function (options)
	{
		return new popup.fn.init(options);
	};

	popup.fn = popup.prototype = 
	{
		version: '2.0.1',
		constructor: popup,
		init: function (options)
		{
			/* Private vaiables */
			var self = this;
	
			var left = 0;
			var top = 0;
			var width = 0;
			var height = 0;

			var container = null;
			var closeBtn = null;
			var loadingImage = null;
			var contentHolder = null;
			var draggable = null;
			var overlay = null;
			var playPauseButton = null;

			var modules = [];

			var embededObject = false;
			var imageList = /\.(jpg|jpeg|gif|png|bmp|tiff)(.*)?$/i;
			var videoList =
			{
				swf:
				{
					regex: /[^\.]\.(swf)\s*$/i
				},
				youtube: 
				{
					regex: /youtube\.com\/watch/i,
					url: "http://www.youtube.com/embed/{id}?autoplay=1&amp;fs=1&amp;rel=0",
					token: '=',
					iframe: 1,
					index: 1
				},
				google:
				{
					regex: /google\.com\/videoplay/i,
					url: "http://video.google.com/googleplayer.swf?autoplay=1&amp;hl=en&amp;docId={id}",
					token: '=',
					index: 1
				},
				vimeo:
				{
					regex: /vimeo\.com/i,
					url: "http://player.vimeo.com/video/{id}?hd=1&amp;autoplay=1&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1",
					token: '/',
					iframe: 1,
					index: 3
				},
				metacafe:
				{
					regex: /metacafe\.com\/watch/i,
					url: "http://www.metacafe.com/fplayer/{id}/.swf?playerVars=autoPlay=yes",
					token: '/',
					index: 4
				}
			};

			/* Public variables */
			this.instance_name = 'instance_' + (Math.random() * 5233);

			this.extend = new Extend();

			this.container = null;
			this.overlay = null;

			/*
			 *	create_popup() - Create the html structure of the popup.
			 */
			this.create_popup = function ()
			{
				// Make sure the theme string is lowercase.
				options.theme = options.theme.toLowerCase();

				// Theme class.
				var theme_class = (options.theme && options.theme != 'default') ? ' speedo-theme-' + options.theme : '';

				// Count the ammount of starts.
				if (options.startCount > 0)
				{
					var started = speedo().utility.get_cookie('speedo-popup-start-count');

					started = (started) ? started : 0;

					if (started >= options.startCount)
					{
						return;
					}
					else
					{
						started++;
						speedo().utility.set_cookie('speedo-popup-start-count', started, options.interval);
					}
				}

				$('body').addClass('speedo-popup-ready');
				// Load the css for the theme.
				//loadTheme(options.theme);

				// Create the popup container.
				container = $(document.createElement('div'));
				container.addClass('speedo-container'+theme_class);

				self.container = container;

				if (options.css3Effects && options.css3Effects != "none")
				{
					container.addClass("speedo-effect-"+options.css3Effects.toLowerCase());
				}
		
				var newWidth = (options.width) ? options.width : 'auto';
				var newheight = (options.height) ? options.height : 'auto';

				container.css(
				{
					display: 'none',
					width: newWidth,
					height: newheight,
					'min-width': 150,
					'min-height': 150,
					left: (options.left == 'center') ? '50%' : options.left,
					top: (options.top == 'center') ? '50%' : options.top
				});

				container.appendTo('body');

				// If the caption option is not empty then we create a container for the caption.
				if (options.caption && options.caption != '')
				{
					var caption = $(document.createElement('p'));

					caption.addClass('speedo-popup-caption');
					caption.html(options.caption);
					container.append(caption);
				}

				// Create the loadingImage container.
				loadingImage = $(document.createElement('div'));

				loadingImage.addClass('speedo-popup-loading');
				container.append(loadingImage);
		
				// Create the content holder.
				contentHolder = $(document.createElement('div'));
				contentHolder.addClass('speedo-content-holder');
				contentHolder.appendTo(container);

				// Create custom buttons.
				var buttons = createButtons(options.buttons);

				if (buttons !== false)
				{
					container.append(buttons);
				}

				//popup.execute_modules(self, options, container);

				/*if (self.draggable(options, container).init())
				{
				}*/

				var contentType = getContentType();

				self.setContent((contentType != "html") ? options.href : options.htmlContent, contentType);

				if (options.close)
				{
					closeBtn = $(document.createElement('a'));
			
					closeBtn.addClass('speedo-ui-close');
					closeBtn.attr('href', 'javascript: void(0);');
					closeBtn.click(function (ev) { options.onClose(ev); self.hidePopup();});
					closeBtn.html(options.closeCaption);
			
					container.append(closeBtn);
				}
		
				// Add overlay div and posibility to close popUp if you click on it
				if (options.overlay)
				{
					overlay = $(document.createElement('div'));
					overlay.addClass('speedo-overlay'+theme_class);
					overlay.appendTo('body');

					self.overlay = overlay;

					// If the function is an object we expect some parameters like opacity, zindex etc.
					if (typeof(options.overlay) == 'object')
					{
						var overlayOptions = $.extend({
							opacity: .70,
							zindex: 10000
						}, options.overlay);

						//overlay.css({opacity: overlayOptions.opacity, 'z-index': overlayOptions.zindex});
					}
			
					if (options.overlayClose)
					{
						overlay.click(function(ev){ options.onClose(ev); self.hidePopup();});
					}
				}

				// Execute all loaded modules.
				this.modules.execute(self, options);

				// On before show.
				options.onBeforeShow(container.get(0));
		
				// Center the popup.
				self.centerPopup();

				$(window).resize(function ()
				{
					// Center the popup.
					self.centerPopup();
				});

				self.showPopup();

				setTimeout(function ()
				{
					self.centerPopup();
				}, 100);
			};
	
			/*
			 *	init() - Initialize events and popup.
			 */
			this.init = function ()
			{
				if (options.esc)
				{
					$(document).bind('keydown', onKeyDown);
				}
			};
	
			/*
			 *	showPopup() - Show the popup.
			 */
			this.showPopup = function ()
			{
				if (embededObject)
				{
					var type = getContentType();
					self.setContent(options.href, type);
				}

				// If ther is no function which extends the show, then we show the popup.
				if (!self.extend.trigger('show') || options.effectIn == null || options.effectOut == 'none')
				{
					container.show();
		
					if (overlay)
					{
						overlay.show();
					}
				}

				// Center the popup.
				self.centerPopup();

				// Callback.
				options.onShow(container.get(0));

				if (options.autoClose)
				{
					setTimeout(function(){ self.hidePopup();}, options.autoClose);
				}
			};
	
			/*
			 *	hidePopup() - hide the popup.
			 */
			this.hidePopup = function ()
			{
				// If ther is no function which extends the hide, then we hide the popup.
				if (!self.extend.trigger('hide') || options.effectOut == null || options.effectOut == 'none')
				{
					container.hide();
		
					if (overlay)
					{
						overlay.hide();
					}

					// We need to remove the flash beacuse we don't want to have the movie/music playing in background.
					self.remove_embeded_object();

					/*self.autoChangeContent(false);
					$(this).removeClass("pause").addClass("play");*/

					if (options.unload)
					{
						if (overlay)
						{
							overlay.remove();
						}
						container.remove();
					}
				}
		
				// On Hide.
				options.onHide(container.get(0));
			};

			/*
			 *	centerPopup() - Center the popup on the screen.
			 */
			this.centerPopup = function ()
			{
				if (width <= 0)
				{
					width = container.width();
					height = container.height();

					//alert('width '+width);

					//console.log("the definition of insanity. "+width+" the new definition "+contentHolder.width());

					if (width > 150)
					{
						container.css({'max-width': width, 'max-height': height});
					}
				}

				//container.css({margin: 40});
				//console.log('Second time '+width);

				if (options.responsive)
				{
					var windowWidth = $(window).width();
					var windowHeight = $(window).height();
					var containerOuterWidth = container.outerWidth();
					var containerOuterHeight = container.outerHeight();
					var paddingHor = parseInt(container.css('padding-left')) + parseInt(container.css('padding-right'));
					var paddingVer = parseInt(container.css('padding-top')) + parseInt(container.css('padding-bottom'));

					if (windowWidth < (width + paddingHor + left) || windowHeight < (height + paddingVer + top))
					{
						var marginHor = parseInt(container.css('margin-left')) + parseInt(container.css('margin-right'));
						var marginVer = parseInt(container.css('margin-top')) + parseInt(container.css('margin-bottom'));
						var containerWidth = container.width();
						var containerHeight = container.height();
						var additionalWidth = (containerOuterWidth + marginHor) - containerWidth;
						var additionalHeight = (containerOuterHeight + marginVer) - containerHeight;

						var newWidth = windowWidth - additionalWidth;
						var newHeight = windowHeight - additionalHeight;

						container.css({'width': newWidth, 'height': newHeight});
					}
				}

				left = (options.left == 'center') ? Math.floor($(window).width() / 2) - (container.outerWidth() / 2) : options.left;
				top = (options.top == 'center') ? Math.floor($(window).height() / 2) - (container.outerHeight() / 2) : options.top;

				container.css(
				{
					left: left,
					top: top
					/*'margin-left': (options.left == 'center') ? -(container.width() / 2) : 0,
					'margin-top': (options.top == 'center') ? -(container.height() / 2) : 0*/
				});

			};
	
			/*
			 *	setContent() - Set popup content.
			 *
			 *	PARAMETERS:
			 *		content		- The contentent.
			 *		type		- The content type.
			 *		complete	- Content loading complete.
			 *
			 *	NOTE:
			 *		If the type is not specified, the function will try to determine
			 *		the type based on the provided content.
			 */
			this.setContent = function (content, type, complete)
			{
				var contentType = (type) ? type : getContentType(content);
				var complete = (complete) ? complete : function () {};

				// Clear the old content.
				contentHolder.html('');

				// Reset the max width so the popup size will be automatically get from the size.
				container.css({'max-width': '', 'max-height': ''});

				if (contentType == "html")
				{
					contentHolder.html(content);

					options.onComplete(container.get(0), contentType);
					complete(container.get(0), contentType);
					loadingImage.hide();
					self.centerPopup();
				}
				else if (contentType == "image")
				{
					var image = new Image();

					image.src	= content;
					$(image).load(function (ev)
					{
						options.onComplete(container.get(0), contentType);
						complete(container.get(0), contentType);
						// Hide the loading image.
						loadingImage.hide();

						//self.width($(this).width());
						//self.height($(this).height());

						container.css({'max-width': $(this).width(), 'max-height': $(this).height()});
						self.centerPopup();
					});
					contentHolder.append(image);
					//contentHolder.html('<img src="'+content+'" />');
				}
				else if (contentType == "ajax")
				{
					// Use ajax to load the popup content.
					$.ajax({
						type: content.type,
						data: content.data,
						url: content.url,
						beforeSend: function ()
						{
						},
						success: function (data)
						{
							contentHolder.html(data);
							// On complete.
							options.onComplete(container.get(0), contentType);
							complete(container.get(0), contentType);
							loadingImage.hide();
							self.centerPopup();
						}
					});
				}
				else if (contentType == "iframe")
				{
					var iFrameContent = $(document.createElement('iframe'));

					iFrameContent.attr('border', 0);
					iFrameContent.attr('frameBorder', 0);
					iFrameContent.attr('marginwidth', 0);
					iFrameContent.attr('marginheight', 0);
					iFrameContent.css({width: options.width, height: options.height});
					iFrameContent.get(0).src = options.href;
					iFrameContent.load(function ()
					{
						// On complete.
						options.onComplete(container.get(0), contentType);
						complete(container.get(0), contentType);
						loadingImage.hide();
						container.css({'max-width': $(this).width(), 'max-height': $(this).height()});
						self.centerPopup();
					});

					contentHolder.append(iFrameContent);
				}
				else if (contentType == "flash")
				{
					var flashObject = buildFlashObject(content, options.width, options.height, options.flashvars);

					contentHolder.append(flashObject);

					setTimeout(function ()
					{
						// On complete.
						options.onComplete(container.get(0), contentType);
						complete(container.get(0), contentType);
						container.css({'max-width': (options.width != 'auto') ? options.width : flashObject.width(), 'max-height': (options.height != 'auto') ? options.height : flashObject.height()});
						self.centerPopup();
						loadingImage.hide();
					}, 80);

					//contentHolder.append(flashObject);
				}
				else	// Unkonown content type.
				{
					contentHolder.html(content);

					options.onComplete(container.get(0), contentType);
					complete(container.get(0), contentType);
					self.centerPopup();
					loadingImage.hide();
				}
			};

			/*
			 *	width() - Get or set the popup width.
			 *
			 *	PARAMETERS:
			 *		value	- The new width value.
			 *		animate	- Animate the resize. Default is true.
			 *
			 *	RETURN VALUE:
			 *		Returns the current width of the popup.
			 */
			this.width = function (value, animate)
			{
				var oldValue = width;
				var animate = (animate == undefined) ? true : animate;

				if (value)
				{
					width = value;

					if (animate)
					{
						container.animate({width: value, left: Math.floor(value / 2)}, "slow");
					}
					else
					{
						container.css('width', value);
					}
				}

				return oldValue;
			};

			/*
			 *	height() - Get or set the popup height.
			 *
			 *	PARAMETERS:
			 *		value	- The new height value.
			 *		animate	- Animate the resize. Default is true.
			 *
			 *	RETURN VALUE:
			 *		Returns the current height of the popup.
			 */
			this.height = function (value, animate)
			{
				var oldValue = height;
				var animate = (animate == undefined) ? true : animate;

				if (value)
				{
					height = value;

					if (animate)
					{
						container.animate({height: value, top: Math.floor(value / 2)}, "slow");
					}
					else
					{
						container.css('height', value);
					}
				}

				return oldValue;
			};

			/*
			 *	remove_embeded_object() - Remove embeded objects.
			 */
			this.remove_embeded_object = function ()
			{
				if (embededObject)
				{
					contentHolder.html(' ');
				}
			};

			/*
			 *	get_box_size() -  Get left, top, width, height.
			 */
			this.get_box_size = function ()
			{
				return {left: left, top: top, width: width, height: height};
			};


			/* Private Functions */

			/*
			 *	createButtons() - Create custom buttons.
			 *
			 *	PARAMETERS:
			 *		buttons	- An array with objects data for buttons.
			 *
			 *	RETURN VALUE:
			 *		If the function succeds, the return value is an html div object with all the buttons.
			 *		If the function fails, the return value is false.
			 */
			function createButtons(buttons)
			{
				if ($.isArray(buttons) && buttons.length > 0)
				{
					var reservedAttr = ['html', 'action'];
					var buttonsContainer = $(document.createElement('div'));

					buttonsContainer.addClass('speedo-popup-custom-buttons');

					for (var i = 0; i < buttons.length; i++)
					{
						var button = $(document.createElement('a'));

						button.attr('href', 'javascript: void(0);');
						if (buttons[i]['html'])
						{
							button.html(buttons[i]['html']);
						}

						for (var key in buttons[i])
						{
							if (reservedAttr.indexOf(key) == -1)
							{
								button.attr(key, buttons[i][key]);
							}
						}

						if ($.isFunction(buttons[i]['action']))
						{
							// Register callback.
							button.click(buttons[i]['action']);
						}

						buttonsContainer.append(button);
					}

					return buttonsContainer;
				}

				return false;
			}

			/*
			 *	getContentType() - Get the content type.
			 *
			 *	PARAMETERS:
			 *		content	- Content.
			 *
			 *	RETURN VALUE:
			 *		Returns the type of the content.
			 */
			function getContentType(content)
			{
				var content = (content) ? content : options.href;
				var videoId = '';

				// Reset the embededObject.
				embededObject = false;

				if ((content == null || content == '') && options.htmlContent)
				{
					return 'html';
				}

				if (content.match(imageList))	// Check if the link is a image.
				{
					return 'image';
				}

				var type = '';

				$.each(videoList, $.proxy(function (i, e)
				{
					if (content.split('?')[0].match(e.regex))
					{
						if (e.token)
						{
					
							if(i =='vimeo' && content.split('/')[3] == 'video')
							{
								e.index = 4;
							}
							var videoId = content.split(e.token)[e.index].split('?')[0].split('&')[0];

							content = e.url.replace('{id}', videoId);

							//options.href = content;
						}

						// Set the default values for the  embeded flash.
						options.width = (options.width) ? options.width : 640;
						options.height = (options.height) ? options.height : 360;

						options.href = content;

						embededObject = true;

						type = (e.iframe) ? 'iframe' : 'flash';
					}
				}, this));

				if (type == '')
				{
					// If we want to use iFrame.
					if (options.useFrame || content.indexOf('http') >= 0)
					{
						type = "iframe";
						embededObject = true;
						options.href = content;
					}
					else
					{
						type = 'ajax';
					}

					var idStart = content.indexOf('#');

					if (idStart === 0)
					{
						var object = content.substr(idStart);

						object = $(object);

						if (object.length > 0)
						{
							type = 'html';
							options.htmlContent = object.html();
						}
					}
				}

				return type;
			}

			/*
			 *	buildFlashObject() - Create the object tag for embeding flash file.
			 *
			 *	PARAMETERS:
			 *		href		- swf location.
			 *		width		- width of the swf.
			 *		height		- height of the swf.
			 *		flashvars	- flash vars.
			 *
			 *	RETURN VALUE:
			 *		Returns the html object.
			 */
			function buildFlashObject(href, width, height, flashvars)
			{
				var flashvars = (flashvars || flashvars == '') ? 'autostart=1&autoplay=1&fullscreenbutton=1' : flashvars;

				/*
				 *	Note: We build all the object and create it one time, for 2 reasons:
				 *		1. IE8 will not append any element to the object tag.
				 *		2. This way is faster than creating evrey element separately, but costs file size.
				 */
				var object = '<object width="'+width+'" height="'+height+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">';

				object += '<param name="movie" value="'+href+'" />'+
						  '<param name="allowFullScreen" value="true" />'+
						  '<param name="allowscriptaccess" value="always" />'+
						  '<param name="wmode" value="transparent" />'+
						  '<param name="autostart" value="true" />'+
						  '<param name="autoplay" value="true" />'+
						  '<param name="flashvars" value="'+flashvars+'" />'+
						  '<param name="width" value="'+width+'" />'+
						  '<param name="height" value="'+height+'" />';

				object += '<embed src="'+href+'" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true"'+
									' autostart="true" autoplay="true" flashvars="'+flashvars+'" wmode="transparent" width="'+width+'"'+
									' height="'+height+'" style="margin: 0; padding: 0" />';

				object += '</object>';

				// Create and return the object.
				return $(object);
			}
	
			/*
			 *	onKeyDown() - On key down event for the whole page.
			 */
			function onKeyDown(ev)
			{
				var keyCode = ev.keyCode || ev.charCode || ev.which;
		
				if (keyCode == 27)		// Escape code.
				{
					self.hidePopup();
				}
			}

			return this;
		}
	};

	// Prepare for later instantiation.
	popup.fn.init.prototype = popup.fn;


	/*
	 *	Extend() - Class to handle the extending part of the popup.
	 *
	 *	Note:
	 *		The actions will not be asynchronus.
	 */
	function Extend()
	{
		var actions = {};

		/*
		 *	add_action() - Add an action to the stack to be executed later by the trigger function.
		 *
		 *	PARAMETERS:
		 *		name		- Action name identifier.
		 *		callback	- Function callback.
		 */
		this.add_action = function (name, callback)
		{
			if (actions[name] == undefined)
			{
				actions[name] = [];
			}

			actions[name].push(callback);
		};

		/*
		 *	remove_action() - Remove an action from the stack.
		 *
		 *	PARAMETERS:
		 *		name		- Action name identifier.
		 *		callback	- Function callback.
		 */
		this.remove_action = function (name, callback)
		{
			if (actions[name] != undefined)
			{
				for (key in actions[name])
				{
					if (actions[name][key] === callback)
					{
						actions[name] = actions[name].splice(key, 1);
					}
				}
			}
		};

		/*
		 *	trigger() - Trigger an action.
		 *
		 *	PARAMETERS:
		 *		name	- Action name identifier.
		 *		data	- Additional data to send to the action.
		 */
		this.trigger = function (name, data)
		{
			var result = false;

			if (actions[name] != undefined)
			{
				for (key in actions[name])
				{
					if ($.isFunction(actions[name][key]))
					{
						actions[name][key](data);

						result = true;
					}
				}
			}

			return result;
		};
	}

	/*
	 *	Events() - Handle popup events.
	 */
	function Events()
	{
		var self = this;
		var $ = jQuery;
	
		var jSelf = $(this);	// jQuery Self.

		/*
		 *	bind() - Bind an event to this instance of the event manager.
		 *
		 *	PARAMETERS:
		 *		event_type	- A string containing one or more event types.
		 *		event_data	- A map of data that will be passed to the event handler.
		 *		event_object	- A function to execute each time the event is triggered.
		 */
		this.bind = function (event_type, event_data, event_object)
		{
			return jSelf.bind(event_type, event_data, event_object);
		};
	
		/*
		 *	unbind() - Unbind an event from this instance of the event manager.
		 *
		 *	PARAMETERS:
		 *		event_type	- A string containing one or more event types.
		 *		event_object	- The function that is to no longer be executed.
		 */
		this.unbind = function (event_type, event_object)
		{
			return jSelf.unbind(event_type, event_object);
		};
	
		/*
		 *	trigger() - Trigger an event attached to this instance of the event manager.
		 *
		 *	PARAMETERS:
		 *		event_type	- A string containing an event type.
		 *		event_data	- Additional parameters to pass along to the event handler.
		 */
		this.trigger = function (event_type, event_data)
		{
			return jSelf.trigger(event_type, event_data);
		};
	}

	// Register event manager.
	popup.fn.events = new Events();

	// Register popup plugin.
	speedo.fn.popup = popup;

})(jQuery, speedo);

/*
 *	speedoPopup() - This shows a better popup.
 */
$.fn.speedoPopup = function (options)
{
	var defaultOptions = {
		width: null,
		height: null,
		left: 'center',
		top: 'center',
		close: true,
		closeCaption: '',
		theme: 'default',
		htmlContent: '<p> Default content </p>',
		esc: true,
		overlay: {
			opacity: .75,
			zindex: 100000
		},
		caption: null,
		href: null,
		overlayClose: true,
		autoClose: false,
		autoShow: false,
		startCount: 0,
		interval: 30,		// 30 Days default.
		effectIn: 'none',
		effectOut: 'none',
		css3Effects: false,
		showOnEvent: 'click',
		useFrame: false,
		useAjax: false,
		loadingImage: false,
		unload: false,
		draggable: false,
		responsive: true,
		ajaxContent:
		{
			url: "",
			type: "POST",
			data: null
		},
		groupGallery: false,
		groupIndex: 0,	// The start index for the group.
		groupAutoPlay: true,
		groupWait: 5000,
		loop: true,
		buttons: null,

		// Callbacks
		onBeforeShow: function () {},		// Before the popup is showing.
		onShow: function () {},				// When the popup is showing.
		onComplete: function () {},			// After the popup content finished loading.
		onHide: function () {},				// When the popup is hiding.
		onClose: function () {}				// When the close button was clicked.
	};

	if (options.href && options.useFrame == null)
	{
		options.useFrame = true;
	}

	// Set CSS3 effects to a random effect.
	if (options.css3Effects == "random")
	{
		var randomEffects = ["none", "zoomIn", "zoomOut", "flip", "flipInHor", "flipInVer",
							"bounceIn", "pageTop", "flyIn", "fadeInScale", "scaleDown", "fadeSpin",
							"pulse", "leftSpeedIn", "rollIn", "rollOut", "pulseBody", "fadeSpinBody"];

		options.css3Effects = randomEffects[Math.floor(Math.random() * (randomEffects.length - 1))];
	}
	
	var options = $.extend(true, defaultOptions, options);
	
	var popupInstance = null;
	
	if (!this.data('unique-speedo-instance') || options.unload)
	{
		popupInstance = speedo().popup(options);
		
		// Wait until the autoShow time passes and then create and show the popup.
		if (options.autoShow)
		{
			setTimeout(function(){ popupInstance.create_popup(); }, options.autoShow);
		}
		else
		{
			popupInstance.create_popup();
		}
		
		//popupInstance.hidePopup();
		//popupInstance.init();
		
		this.data('unique-speedo-instance', popupInstance);
	}
	else
	{
		popupInstance = this.data('unique-speedo-instance');
		
		// Wait until the autoShow time passes and then show the popup.
		if (options.autoShow)
		{
			setTimeout(function(){ popupInstance.showPopup(); }, options.autoShow);
		}
		else
		{
			popupInstance.showPopup();
			popupInstance.centerPopup();
			//popupInstance.setContent(options.href);
		}
		
	}
	
	return popupInstance;
};

$(function ()
{
	$.speedoPopup = {};
	$.speedoPopup.smartSkins = {};

	// Set the speedo.browser.is_ie utility variable.
	$.speedoPopup.browser_ie = speedo().browser.is_ie;

	/*
	 *	registerSmartSkin() - Register smart skin.
	 */
	$.speedoPopup.registerSmartSkin = function (name, func)
	{
		$.speedoPopup.smartSkins[name] = func;
	};

	// Listen globally for the speedo-popup class to use the popup as a lightbox.
	$(document).on('click tap', '.speedo-popup', function (ev)
	{
		ev.preventDefault();
		//ev.stopPropagation();

		var $cliked = $(this);
		var href	= $cliked.attr('href');
		var groupGallery = [];
		var relAttribute = $cliked.attr('rel');
		var groupIndex = 0;

		if (relAttribute && relAttribute != '')
		{
			
			$('.speedo-popup[rel="'+relAttribute+'"]').each(function (index)
			{
				var $this = $(this);

				// If the element's are the same, set the start index to the current index.
				if ($this.get(0) == $cliked.get(0))
				{
					groupIndex = index;
				}

				groupGallery.push({url: $this.attr('href'), title: $this.attr('title')});
			});
		}

		if ($(this).data('speedoOptions') != undefined)
		{
			query = $(this).data('speedoOptions');
		}
		else
		{
			// Deprecated - use data-speedo-options instead.
			var query = speedo().utility.query_parameters(href);
		}

		var options = $.extend({
			htmlContent: false,
			effectIn: 'fade',
			effectOut: 'fade'
		}, query);

		if (options.useAjax)
		{
			options.ajaxContent = {
				url: href,
				type: "GET",
				data: null
			}
		}

		options.href = href;

		$(this).speedoPopup(options);
	});
});

(function ($, popup)
{
	/*
	 *	modules - Create main core.
	 */
	var modules = function ()
	{
		return new modules.fn.init();
	};

	modules.fn = modules.prototype = 
	{
		version: '1.0.1',
		constructor: modules,
		init: function ()
		{
			var modules_list = {};

			/*
			 *	register_module() - Add a module in the execute list.
			 */
			this.register_module = function (name, callback)
			{
				modules_list[name] = callback;
			};

			/*
			 *	deregister_module() - Remove a module from the execute list.
			 */
			this.deregister_module = function (name)
			{
				modules_list[name] = null;
			};

			/*
			 *	clear() - Remove all modules from the execute list.
			 */
			this.clear = function ()
			{
				modules_list = {};
			};

			/*
			 *	execute() - Execute modules.
			 */
			this.execute = function (instance, options)
			{
				for (key in modules_list)
				{
					var module = modules_list[key];

					if ($.isFunction(module))
					{
						var module_instance = module.apply(instance, [options]);

						if (module_instance != null)
						{
							module_instance.init();
						}
					}
				}

				return null;
			};

			return this;
		}
	};

	// Prepare for later instantiation.
	modules.fn.init.prototype = modules.fn;

	// Create a new instance of the modules in the popup class.
	popup.fn.modules = modules();

})(jQuery, speedo().popup);

(function ($, popup)
{
	/*
	 *	draggable() - Handle popup drag.
	 */
	popup.fn.modules.register_module('draggable', function (options)
	{
		var draggable = null
		var $window = $(window);
		var container = this.container;

		/*
		 *	init() - Initialize module.
		 */
		this.init = function ()
		{
			// If the draggable option is true we need to be able to drag the window.
			if (options.draggable)
			{
				draggable = $(document.createElement('div'));

				draggable.addClass('speedo-popup-drag-area');
				draggable.bind('mousedown', onMouseDown);

				container.append(draggable);
			}	
		};

		/*
		 *	onMouseDown() - When the mouse is down over the popup container we want to dragg the container.
		 */
		function onMouseDown(ev)
		{
			var offset = container.position();
			var startOffset = {startX: ev.clientX, startY: ev.clientY, offset: offset};

			// Register the mouse up event for ending the dragg and the mouse move for moving the window.
			$window.bind('mousemove', startOffset, onMouseMove).bind('mouseup', onMouseUp);
		}

		/*
		 *	onMouseMove() - Move the container according to the mouse position.
		 */
		function onMouseMove(ev)
		{
			var offset = ev.data.offset;
			var xPos = ev.clientX - ev.data.startX + offset.left;
			var yPos = ev.clientY - ev.data.startY + offset.top;

			//if (ev.target === draggable.get(0))
			{
				container.css({left: xPos, top: yPos});
			}
		}

		/*
		 *	onMouseUp() - Ending the drag.
		 */
		function onMouseUp()
		{
			// Unregister the events for dragging.
			$window.unbind('mousemove', onMouseMove).unbind('mouseup', onMouseUp);
		}

		return this;
	});

})(jQuery, speedo().popup);

(function ($, popup, speedo)
{
	/*
	 *	effects() - Handle popup drag.
	 */
	popup.fn.modules.register_module('effects', function (options)
	{
		var $window = $(window);
		var container = this.container;
		var overlay = this.overlay;
		var self = this;

		var left = 0;
		var top = 0;
		var width = 0;
		var height = 0;

		/*
		 *	init() - Initialize module.
		 */
		this.init = function ()
		{
			// Extend the show and hide functionality so we can add effects to show and hide.
			self.extend.add_action('show', on_show);
			self.extend.add_action('hide', on_hide);
		};

		/*
		 *	animatePopup() - Animate the popup for showing or hiding.
		 *
		 *	PARAMETERS:
		 *		effect		- Specify the effect to use. You can use one of the following:
		 *						'fade'			- Fade in/out effect.
		 *						'slideLeft'		- Slide left effect.
		 *						'slideRight'	- Slide right effect.
		 *		speed		- Specify the effect speed.
		 *		show		- Specify if the animation is for showing the popup or hidding the popup.
		 *		callback	- Speicfy a callback to be called when the animation finished.
		 */
		this.animatePopup = function (effect, speed, show, callback)
		{
			var callback = ($.isFunction(callback)) ? callback : function () {};
			//var effect = effect + ((show) ? 'In' : 'Out');

			if (show)
			{
				container.hide();
				if (overlay)
				{
					overlay.hide();
				}
			}

			switch (effect)
			{
			case 'slideLeft':
					if (show)
					{
						container.css('left', -width);
						container.stop().animate({left: left, opacity: 'toggle'}, speed, callback);
					}
					else
					{
						container.stop().animate({left: -width, opacity: 'toggle'}, speed, callback);
					}
				break;

			case 'slideRight':
					if (show)
					{
						container.css('left', $(window).width() + width);
						container.stop().animate({left: left, opacity: 'toggle'}, speed, callback);
					}
					else
					{
						container.stop().animate({left: $(window).width() + width, opacity: 'toggle'}, speed, callback);
					}
				break;

			case 'slideTop':
					if (show)
					{
						container.css('top', -height);
						container.stop().animate({top: top, opacity: 'toggle'}, speed, callback);
					}
					else
					{
						//container.css('top', top);
						container.stop().animate({top: -height, opacity: 'toggle'}, speed, callback);
					}
				break;

			case 'slideBottom':
					if (show)
					{
						container.css('top', $(window).height() + height);
						container.stop().animate({top: top, opacity: 'toggle'}, speed, callback);
					}
					else
					{
						container.stop().animate({top: $(window).height() + height, opacity: 'toggle'}, speed, callback);
					}
				break;

			case 'slideZoom':
					if (show)
					{
						container.css('top', -height);
						container.css('left', left + (width / 2));

						container.stop().animate({width: 'toggle',  left: left, top: top, opacity: 'toggle'}, speed, callback);
					}
					else
					{
						container.stop().animate({top: -height,  left: left + (width / 2), width: 'toggle', opacity: 'toggle'}, speed, callback);
					}
				break;

			case 'growBox':
					container.stop().animate({width: 'toggle', height: 'toggle'}, callback);
				break;

			case 'incerto':
					if (show)
					{
						container.css('left', left + (width / 2));
						container.stop().animate({width: 'toggle',  left: left}, speed, callback);

						container.css('top', top + (height / 2));
						container.animate({top: top}, speed, callback);
					}
					else
					{
						container.stop().animate({top: top + (height / 2)}, speed, callback);

						container.animate({width: 'toggle',  left: left + (width / 2)}, speed, callback);
					}
				break;

			case 'fade':
			default:
				var funcEff = (show) ? 'fadeIn' : 'fadeOut';

				container.stop();

				container[funcEff](speed, callback);
				break;
			}

			if (overlay)
			{
				overlay.stop().animate({opacity: 'toggle'}, speed, function ()
				{
					if (speedo().browser.is_ie == true && speedo().browser.version.high <= 8)
					{
						// We want to remove the filter attribute so we see the transparency.
						// Note: The css('filter', '') or get(0).style.filter = '' won't work.
						overlay.get(0).style.removeAttribute('filter', false);
					}
					//overlay.css({'filter': 'none', background: 'orange'});
				});
			}
		};

		/* Private functions */

		/*
		 *	handleEffects() - Handle in/out effects.
		 *
		 *	PARAMETERS:
		 *		effect			- Effect to use.
		 *		css3Effect		- CSS3 effect.
		 *		show			- Specify if the effect is for show or for hide.
		 *		contentChange	- Specify if the effect is for content change.
		 *		callback		- Called when the animation finished.
		 *
		 *	RETURN VALUE:
		 *		If the function succeds, the return value is true, otherwise is false.
		 */
		function handleEffects(effect, css3Effect, show, contentChange, callback)
		{
			if (css3Effect && css3Effect != 'none' && (!speedo().browser.is_ie || speedo().browser.is_ie > 9))
			{
				/*if ($.isFunction(callback))
				{
					container.bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', callback);
				}*/

				var animationEnd = function (ev)
				{
					if ($.isFunction(callback))
					{
						callback();
					}
					// We want to unbind this event after it has been executed so we don't brake something.
					container.unbind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', animationEnd);
				};

				container.bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', animationEnd);

				// Reset the animation so we can play back;
				/*container.css({
					"-webkit-animation-name": "none",
					"-moz-animation-name": "none",
					"-o-animation-name": "none",
					"-ms-animation-name": "none",
					"animation-name": "none"
				});

				setTimeout(function ()
				{
					container.css({
						"-webkit-animation-name": "",
						"-moz-animation-name": "",
						"-o-animation-name": "",
						"-ms-animation-name": "",
						"animation-name": ""
					});
				}, 1);*/

				if (show)
				{
					container.show();

					if(overlay)
					{
						overlay.show();
					}

					$('body').addClass("speedo-effect-"+ css3Effect.toLowerCase() +"-active");
					container.removeClass("speedo-effect-"+ css3Effect.toLowerCase() +"-reverse");
					container.addClass("speedo-effect-"+ css3Effect.toLowerCase() +"-normal");

					/*container.css({
						"-webkit-animation-direction": "normal",
						"-moz-animation-direction": "normal",
						"-o-animation-direction": "normal",
						"-ms-animation-direction": "normal",
						"animation-direction": "normal"
					});*/
				}
				else
				{
					//container.hide();

					/*container.css({
						"-webkit-animation-direction": "reverse",
						"-mox-animation-direction": "reverse",
						"-o-animation-direction": "reverse",
						"-ms-animation-direction": "reverse",
						"animation-direction": "reverse"
					});*/

					$('body').removeClass("speedo-effect-"+ css3Effect.toLowerCase() +"-active");
					container.addClass("speedo-effect-"+ css3Effect.toLowerCase() +"-reverse");
					container.removeClass("speedo-effect-"+ css3Effect.toLowerCase() +"-normal");

					if(overlay && !contentChange)
					{
						overlay.hide();
					}
				}

				container.css({
					"-webkit-animation-play-state": "running",
					"-moz-animation-play-state": "running",
					"-o-animation-play-state": "running",
					"-ms-animation-play-state": "running",
					"animation-play-state": "running"
				});

				return true;
			}

			if (effect && effect != 'none')
			{
				// If this is a function then we call it because we assume the user will handle the showing.
				if ($.isFunction(effect))
				{
					if (options.overlay)
					{
						effect(container.get(0), overlay.get(0));
					}
					else
					{
						effect(container.get(0));
					}
				}
				else if ($.isArray(effect))	// If this is a array we assume that it contains the effect name and the speed.
				{
					self.animatePopup(effect[0], effect[1], show, callback);
				}
				else // We assume that what remains is the effect name so we pass it to the animate function .
				{
					self.animatePopup(effect, 'slow', show, callback);
				}

				return true;
			}

			return false;
		}

		/*
		 *	on_show() - Called when the popup shows.
		 */
		function on_show(ev)
		{
			var size = self.get_box_size();

			left = size.left;
			top = size.top;
			width = size.width;
			height = size.height;

			if (!handleEffects(options.effectIn, options.css3Effects, true))
			{
				container.show();
		
				if (overlay)
				{
					overlay.show();
				}

			}
		}

		/*
		 *	on_hide() - called when the popup hides.
		 */
		function on_hide(ev)
		{
			var size = self.get_box_size();

			left = size.left;
			top = size.top;
			width = size.width;
			height = size.height;

			var effects = handleEffects(options.effectOut, options.css3Effects, false, false, function ()
			{
				// We need to remove the flash beacuse we don't want to have the movie/music playing in background.
				self.remove_embeded_object();

				if (overlay)
				{
					overlay.hide();
				}

				container.hide();

				if (options.unload)
				{
					if (overlay)
					{
						overlay.remove();
					}
					container.remove();
				}
			});
		}

		return self;
	});

})(jQuery, speedo().popup, speedo);

(function ($, popup, speedo, window)
{
	/*
	 *	smartskin() - Smart skin engine.
	 */
	popup.fn.modules.register_module('smartskin', function (options)
	{
		var $window = $(window);
		var container = this.container;
		var overlay = this.overlay;
		var self = this;

		/*
		 *	init() - Initialize module.
		 */
		this.init = function ()
		{
			
			// Extend the show and hide functionality so we can add effects to show and hide.
			self.extend.add_action('show', on_show);
			/*self.extend.add_action('hide', on_hide);*/

		};

		/*
		 *	on_show() - Called when the popup shows.
		 */
		function on_show()
		{
			popup.SmartSkin.run_skin(options.theme, self);

			// Depreacated.
			if ($.speedoPopup.smartSkins[options.theme] != undefined)
			{
				$.speedoPopup.smartSkins[options.theme](overlay, container);
			}
		}

		return self;
	});

	/*
	 *	SmartSkin() - Class to manage smart skins.
	 */
	function SmartSkin()
	{
		var self = this;

		var skins_stack = {};

		/*
		 *	register_skin() - Register smart skin.
		 *
		 *	PARAMETERS:
		 *		name		- Skin name.
		 *		callback	- Main entry function.
		 */
		this.register_skin = function (name, callback)
		{
			skins_stack[name] = callback;
		};

		/*
		 *	run_skin() - Run skin.
		 *
		 *	PARAMETERS:
		 *		name		- Skin name.
		 *		instance	- Popup instance.
		 */
		this.run_skin = function (name, instance)
		{
			if (skins_stack[name] != undefined)
			{
				skins_stack[name](instance.overlay, instance.container);
			}
		};
	}

	popup.SmartSkin = new SmartSkin();

})(jQuery, speedo().popup, speedo, window);

(function ($, popup, speedo, window)
{
	/*
	 *	audio() - Smart skin engine.
	 */
	popup.fn.modules.register_module('audio', function (options)
	{
		var $window = $(window);
		var container = this.container;
		var overlay = this.overlay;
		var self = this;
		var options = options;

		this.audio_element = null;

		/*
		 *	init() - Initialize module.
		 */
		this.init = function ()
		{
			options = $.extend(options,
			{
				autoplayAudio: true,
				loop: false,
				mp3Path: undefined,
				oggPath: undefined,
				volume: 1,
				onAudioStart: function () {},
				onAudioStop: function () {}
			});


			if (options.mp3Path != undefined || options.oggPath != undefined)
			{
				self.extend.add_action('show', on_show);
				self.extend.add_action('hide', on_hide);
			}
		};

		/*
		 *	load_audio() - Load HTML5 audio files.
		 *
		 *	PARAMETERS:
		 *		mp3Path	- Path to the mp3 file.
		 *		oggPath - Path to the ogg file.
		 *		on_load - On audio loaded.
		 */
		this.load_audio = function (mp3Path, oggPath)
		{
			var audio_element = $(document.createElement('audio'));

			if (options.autoplayAudio)
			{
				audio_element.attr('autoplay', 'autoplay');
			}

			if (options.loop)
			{
				audio_element.attr('loop', 'loop');
			}

			audio_element.get(0).volume = 0;//options.volume;

			audio_element.bind('play', function (ev)
			{
				options.onAudioStart(ev);

				self.audio_element.stop().animate({volume: options.volume}, 2000);
			});

			audio_element.bind('stop pause ended', options.onAudioStop);

			var source_element = $(document.createElement('source'));

			source_element.attr('src', oggPath).attr('type', 'audio/ogg');
			audio_element.append(source_element);

			source_element = $(document.createElement('source'));

			source_element.attr('src', mp3Path).attr('type', 'audio/mpeg');
			audio_element.append(source_element);

			$('body').append(audio_element);

			self.audio_element = audio_element;
		};

		/*
		 *	play_audio() - Play the audio.
		 */
		this.play_audio = function ()
		{
			if (self.audio_element != null)
			{
				self.audio_element.get(0).play();
			}
		};

		/*
		 *	stop_audio() - Stop the audio.
		 */
		this.stop_audio = function ()
		{
			if (self.audio_element != null)
			{
				self.audio_element.get(0).pause();
			}
		};

		/*
		 *	get_audio_element() - Get the audio element.
		 */
		this.get_audio_element = function ()
		{
			return this.audio_element;
		};

		/*
		 *	on_show() - Called when the popup shows.
		 */
		function on_show()
		{
			self.load_audio(options.mp3Path, options.oggPath);
		}

		/*
		 *	on_hide() - Called when the popup shows.
		 */
		function on_hide()
		{
			self.audio_element.stop().animate({volume: 0}, 'slow', function ()
			{
				self.audio_element.remove();
			})
		}

		return self;
	});

})(jQuery, speedo().popup, speedo, window);