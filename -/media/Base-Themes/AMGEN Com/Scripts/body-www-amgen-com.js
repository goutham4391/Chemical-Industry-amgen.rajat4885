/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2014, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($, window, document, undefined) {
    'use strict';

    var header_helpers = function(class_array) {
        var i = class_array.length;
        var head = $('head');

        while (i--) {
            if (head.has('.' + class_array[i]).length === 0) {
                head.append('<meta class="' + class_array[i] + '" />');
            }
        }
    };

    header_helpers([
        'foundation-mq-small',
        'foundation-mq-medium',
        'foundation-mq-large',
        'foundation-mq-xlarge',
        'foundation-mq-xxlarge',
        'foundation-data-attribute-namespace'
    ]);

    // Enable FastClick if present

    $(function() {
        if (typeof FastClick !== 'undefined') {
            // Don't attach to body if undefined
            if (typeof document.body !== 'undefined') {
                FastClick.attach(document.body);
            }
        }
    });

    // private Fast Selector wrapper,
    // returns jQuery object. Only use where
    // getElementById is not available.
    var S = function(selector, context) {
        if (typeof selector === 'string') {
            if (context) {
                var cont;
                if (context.jquery) {
                    cont = context[0];
                    if (!cont) return context;
                } else {
                    cont = context;
                }
                return $(cont.querySelectorAll(selector));
            }

            return $(document.querySelectorAll(selector));
        }

        return $(selector, context);
    };

    // Namespace functions.

    var attr_name = function(init) {
        var arr = [];
        if (!init) arr.push('data');
        if (this.namespace.length > 0) arr.push(this.namespace);
        arr.push(this.name);

        return arr.join('-');
    };

    var add_namespace = function(str) {
        var parts = str.split('-'),
            i = parts.length,
            arr = [];

        while (i--) {
            if (i !== 0) {
                arr.push(parts[i]);
            } else {
                if (this.namespace.length > 0) {
                    arr.push(this.namespace, parts[i]);
                } else {
                    arr.push(parts[i]);
                }
            }
        }

        return arr.reverse().join('-');
    };

    // Event binding and data-options updating.

    var bindings = function(method, options) {
        var self = this,
            should_bind_events = !S(this).data(this.attr_name(true));

        if (S(this.scope).is('[' + this.attr_name() + ']')) {
            S(this.scope).data(this.attr_name(true) + '-init', $.extend({}, this.settings, (options || method), this.data_options(S(this.scope))));
            if (should_bind_events) {
                this.events(this.scope);
            }

        } else {
            S('[' + this.attr_name() + ']', this.scope).each(function() {
                var should_bind_events = !S(this).data(self.attr_name(true) + '-init');
                S(this).data(self.attr_name(true) + '-init', $.extend({}, self.settings, (options || method), self.data_options(S(this))));

                if (should_bind_events) {
                    self.events(this);
                }
            });
        }
        // # Patch to fix #5043 to move this *after* the if/else clause in order for Backbone and similar frameworks to have improved control over event binding and data-options updating.
        if (typeof method === 'string') {
            return this[method].call(this, options);
        }

    };

    var single_image_loaded = function(image, callback) {
        function loaded() {
            callback(image[0]);
        }

        function bindLoad() {
            this.one('load', loaded);

            if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                var src = this.attr('src'),
                    param = src.match(/\?/) ? '&' : '?';

                param += 'random=' + (new Date()).getTime();
                this.attr('src', src + param);
            }
        }

        if (!image.attr('src')) {
            loaded();
            return;
        }

        if (image[0].complete || image[0].readyState === 4) {
            loaded();
        } else {
            bindLoad.call(image);
        }
    };

    /*
      https://github.com/paulirish/matchMedia.js
    */

    window.matchMedia = window.matchMedia || (function(doc) {

        "use strict";

        var bool,
            docElem = doc.documentElement,
            refNode = docElem.firstElementChild || docElem.firstChild,
            // fakeBody required for <FF4 when executed in <head>
            fakeBody = doc.createElement("body"),
            div = doc.createElement("div");

        div.id = "mq-test-1";
        div.style.cssText = "position:absolute;top:-100em";
        fakeBody.style.background = "none";
        fakeBody.appendChild(div);

        return function(q) {

            div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

            docElem.insertBefore(fakeBody, refNode);
            bool = div.offsetWidth === 42;
            docElem.removeChild(fakeBody);

            return {
                matches: bool,
                media: q
            };

        };

    }(document));

    /*
     * jquery.requestAnimationFrame
     * https://github.com/gnarf37/jquery-requestAnimationFrame
     * Requires jQuery 1.8+
     *
     * Copyright (c) 2012 Corey Frang
     * Licensed under the MIT license.
     */

    (function($) {

        // requestAnimationFrame polyfill adapted from Erik Möller
        // fixes from Paul Irish and Tino Zijdel
        // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

        var animating,
            lastTime = 0,
            vendors = ['webkit', 'moz'],
            requestAnimationFrame = window.requestAnimationFrame,
            cancelAnimationFrame = window.cancelAnimationFrame,
            jqueryFxAvailable = 'undefined' !== typeof jQuery.fx;

        for (; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
            requestAnimationFrame = window[vendors[lastTime] + "RequestAnimationFrame"];
            cancelAnimationFrame = cancelAnimationFrame ||
                window[vendors[lastTime] + "CancelAnimationFrame"] ||
                window[vendors[lastTime] + "CancelRequestAnimationFrame"];
        }

        function raf() {
            if (animating) {
                requestAnimationFrame(raf);

                if (jqueryFxAvailable) {
                    jQuery.fx.tick();
                }
            }
        }

        if (requestAnimationFrame) {
            // use rAF
            window.requestAnimationFrame = requestAnimationFrame;
            window.cancelAnimationFrame = cancelAnimationFrame;

            if (jqueryFxAvailable) {
                jQuery.fx.timer = function(timer) {
                    if (timer() && jQuery.timers.push(timer) && !animating) {
                        animating = true;
                        raf();
                    }
                };

                jQuery.fx.stop = function() {
                    animating = false;
                };
            }
        } else {
            // polyfill
            window.requestAnimationFrame = function(callback) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };

        }

    }(jQuery));


    function removeQuotes(string) {
        if (typeof string === 'string' || string instanceof String) {
            string = string.replace(/^['\\/"]+|(;\s?})+|['\\/"]+$/g, '');
        }

        return string;
    }

    window.Foundation = {
        name: 'Foundation',

        version: '5.4.6',

        media_queries: {
            small: S('.foundation-mq-small').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
            medium: S('.foundation-mq-medium').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
            large: S('.foundation-mq-large').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
            xlarge: S('.foundation-mq-xlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
            xxlarge: S('.foundation-mq-xxlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
        },

        stylesheet: $('<style></style>').appendTo('head')[0].sheet,

        global: {
            namespace: undefined
        },

        init: function(scope, libraries, method, options, response) {
            var args = [scope, method, options, response],
                responses = [];

            // check RTL
            this.rtl = /rtl/i.test(S('html').attr('dir'));

            // set foundation global scope
            this.scope = scope || this.scope;

            this.set_namespace();

            if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
                if (this.libs.hasOwnProperty(libraries)) {
                    responses.push(this.init_lib(libraries, args));
                }
            } else {
                for (var lib in this.libs) {
                    responses.push(this.init_lib(lib, libraries));
                }
            }

            S(window).load(function() {
                S(window)
                    .trigger('resize.fndtn.clearing')
                    .trigger('resize.fndtn.dropdown')
                    .trigger('resize.fndtn.equalizer')
                    .trigger('resize.fndtn.interchange')
                    .trigger('resize.fndtn.joyride')
                    .trigger('resize.fndtn.magellan')
                    .trigger('resize.fndtn.topbar')
                    .trigger('resize.fndtn.slider');
            });

            return scope;
        },

        init_lib: function(lib, args) {
            if (this.libs.hasOwnProperty(lib)) {
                this.patch(this.libs[lib]);

                if (args && args.hasOwnProperty(lib)) {
                    if (typeof this.libs[lib].settings !== 'undefined') {
                        $.extend(true, this.libs[lib].settings, args[lib]);
                    } else if (typeof this.libs[lib].defaults !== 'undefined') {
                        $.extend(true, this.libs[lib].defaults, args[lib]);
                    }
                    return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
                }

                args = args instanceof Array ? args : new Array(args); // PATCH: added this line
                return this.libs[lib].init.apply(this.libs[lib], args);
            }

            return function() {};
        },

        patch: function(lib) {
            lib.scope = this.scope;
            lib.namespace = this.global.namespace;
            lib.rtl = this.rtl;
            lib['data_options'] = this.utils.data_options;
            lib['attr_name'] = attr_name;
            lib['add_namespace'] = add_namespace;
            lib['bindings'] = bindings;
            lib['S'] = this.utils.S;
        },

        inherit: function(scope, methods) {
            var methods_arr = methods.split(' '),
                i = methods_arr.length;

            while (i--) {
                if (this.utils.hasOwnProperty(methods_arr[i])) {
                    scope[methods_arr[i]] = this.utils[methods_arr[i]];
                }
            }
        },

        set_namespace: function() {

            // Description:
            //    Don't bother reading the namespace out of the meta tag
            //    if the namespace has been set globally in javascript
            //
            // Example:
            //    Foundation.global.namespace = 'my-namespace';
            // or make it an empty string:
            //    Foundation.global.namespace = '';
            //
            //

            // If the namespace has not been set (is undefined), try to read it out of the meta element.
            // Otherwise use the globally defined namespace, even if it's empty ('')
            var namespace = (this.global.namespace === undefined) ? $('.foundation-data-attribute-namespace').css('font-family') : this.global.namespace;

            // Finally, if the namsepace is either undefined or false, set it to an empty string.
            // Otherwise use the namespace value.
            this.global.namespace = (namespace === undefined || /false/i.test(namespace)) ? '' : namespace;
        },

        libs: {},

        // methods that can be inherited in libraries
        utils: {

            // Description:
            //    Fast Selector wrapper returns jQuery object. Only use where getElementById
            //    is not available.
            //
            // Arguments:
            //    Selector (String): CSS selector describing the element(s) to be
            //    returned as a jQuery object.
            //
            //    Scope (String): CSS selector describing the area to be searched. Default
            //    is document.
            //
            // Returns:
            //    Element (jQuery Object): jQuery object containing elements matching the
            //    selector within the scope.
            S: S,

            // Description:
            //    Executes a function a max of once every n milliseconds
            //
            // Arguments:
            //    Func (Function): Function to be throttled.
            //
            //    Delay (Integer): Function execution threshold in milliseconds.
            //
            // Returns:
            //    Lazy_function (Function): Function with throttling applied.
            throttle: function(func, delay) {
                var timer = null;

                return function() {
                    var context = this,
                        args = arguments;

                    if (timer == null) {
                        timer = setTimeout(function() {
                            func.apply(context, args);
                            timer = null;
                        }, delay);
                    }
                };
            },

            // Description:
            //    Executes a function when it stops being invoked for n seconds
            //    Modified version of _.debounce() http://underscorejs.org
            //
            // Arguments:
            //    Func (Function): Function to be debounced.
            //
            //    Delay (Integer): Function execution threshold in milliseconds.
            //
            //    Immediate (Bool): Whether the function should be called at the beginning
            //    of the delay instead of the end. Default is false.
            //
            // Returns:
            //    Lazy_function (Function): Function with debouncing applied.
            debounce: function(func, delay, immediate) {
                var timeout, result;
                return function() {
                    var context = this,
                        args = arguments;
                    var later = function() {
                        timeout = null;
                        if (!immediate) result = func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, delay);
                    if (callNow) result = func.apply(context, args);
                    return result;
                };
            },

            // Description:
            //    Parses data-options attribute
            //
            // Arguments:
            //    El (jQuery Object): Element to be parsed.
            //
            // Returns:
            //    Options (Javascript Object): Contents of the element's data-options
            //    attribute.
            data_options: function(el, data_attr_name) {
                data_attr_name = data_attr_name || 'options';
                var opts = {},
                    ii, p, opts_arr,
                    data_options = function(el) {
                        var namespace = Foundation.global.namespace;

                        if (namespace.length > 0) {
                            return el.data(namespace + '-' + data_attr_name);
                        }

                        return el.data(data_attr_name);
                    };

                var cached_options = data_options(el);

                if (typeof cached_options === 'object') {
                    return cached_options;
                }

                opts_arr = (cached_options || ':').split(';');
                ii = opts_arr.length;

                function isNumber(o) {
                    return !isNaN(o - 0) && o !== null && o !== "" && o !== false && o !== true;
                }

                function trim(str) {
                    if (typeof str === 'string') return $.trim(str);
                    return str;
                }

                while (ii--) {
                    p = opts_arr[ii].split(':');
                    p = [p[0], p.slice(1).join(':')];

                    if (/true/i.test(p[1])) p[1] = true;
                    if (/false/i.test(p[1])) p[1] = false;
                    if (isNumber(p[1])) {
                        if (p[1].indexOf('.') === -1) {
                            p[1] = parseInt(p[1], 10);
                        } else {
                            p[1] = parseFloat(p[1]);
                        }
                    }

                    if (p.length === 2 && p[0].length > 0) {
                        opts[trim(p[0])] = trim(p[1]);
                    }
                }

                return opts;
            },

            // Description:
            //    Adds JS-recognizable media queries
            //
            // Arguments:
            //    Media (String): Key string for the media query to be stored as in
            //    Foundation.media_queries
            //
            //    Class (String): Class name for the generated <meta> tag
            register_media: function(media, media_class) {
                if (Foundation.media_queries[media] === undefined) {
                    $('head').append('<meta class="' + media_class + '"/>');
                    Foundation.media_queries[media] = removeQuotes($('.' + media_class).css('font-family'));
                }
            },

            // Description:
            //    Add custom CSS within a JS-defined media query
            //
            // Arguments:
            //    Rule (String): CSS rule to be appended to the document.
            //
            //    Media (String): Optional media query string for the CSS rule to be
            //    nested under.
            add_custom_rule: function(rule, media) {
                if (media === undefined && Foundation.stylesheet) {
                    Foundation.stylesheet.insertRule(rule, Foundation.stylesheet.cssRules.length);
                } else {
                    var query = Foundation.media_queries[media];

                    if (query !== undefined) {
                        Foundation.stylesheet.insertRule('@media ' +
                            Foundation.media_queries[media] + '{ ' + rule + ' }');
                    }
                }
            },

            // Description:
            //    Performs a callback function when an image is fully loaded
            //
            // Arguments:
            //    Image (jQuery Object): Image(s) to check if loaded.
            //
            //    Callback (Function): Function to execute when image is fully loaded.
            image_loaded: function(images, callback) {
                var self = this,
                    unloaded = images.length;

                if (unloaded === 0) {
                    callback(images);
                }

                images.each(function() {
                    single_image_loaded(self.S(this), function() {
                        unloaded -= 1;
                        if (unloaded === 0) {
                            callback(images);
                        }
                    });
                });
            },

            // Description:
            //    Returns a random, alphanumeric string
            //
            // Arguments:
            //    Length (Integer): Length of string to be generated. Defaults to random
            //    integer.
            //
            // Returns:
            //    Rand (String): Pseudo-random, alphanumeric string.
            random_str: function() {
                if (!this.fidx) this.fidx = 0;
                this.prefix = this.prefix || [(this.name || 'F'), (+new Date).toString(36)].join('-');

                return this.prefix + (this.fidx++).toString(36);
            }
        }
    };

    $.fn.foundation = function() {
        var args = Array.prototype.slice.call(arguments, 0);

        return this.each(function() {
            Foundation.init.apply(Foundation, [this].concat(args));
            return this;
        });
    };

}(jQuery, window, window.document));

;
(function($, window, document, undefined) {
    'use strict';

    Foundation.libs.offcanvas = {
        name: 'offcanvas',

        version: '5.4.6',

        settings: {
            open_method: 'move',
            close_on_click: false
        },

        init: function(scope, method, options) {
            this.bindings(method, options);
        },

        events: function() {
            var self = this,
                S = self.S,
                move_class = '',
                right_postfix = '',
                left_postfix = '';

            if (this.settings.open_method === 'move') {
                move_class = 'move-';
                right_postfix = 'right';
                left_postfix = 'left';
            } else if (this.settings.open_method === 'overlap_single') {
                move_class = 'offcanvas-overlap-';
                right_postfix = 'right';
                left_postfix = 'left';
            } else if (this.settings.open_method === 'overlap') {
                move_class = 'offcanvas-overlap';
            }

            S(this.scope).off('.offcanvas')
                .on('click.fndtn.offcanvas', '.left-off-canvas-toggle', function(e) {
                    self.click_toggle_class(e, move_class + right_postfix);
                    if (self.settings.open_method !== 'overlap') {
                        S(".left-submenu").removeClass(move_class + right_postfix);
                    }
                    $('.left-off-canvas-toggle').attr('aria-expanded', 'true');
                })
                .on('click.fndtn.offcanvas', '.left-off-canvas-menu a', function(e) {
                    var settings = self.get_settings(e);
                    var parent = S(this).parent();

                    if (settings.close_on_click && !parent.hasClass("has-submenu") && !parent.hasClass("back")) {
                        self.hide.call(self, move_class + right_postfix, self.get_wrapper(e));
                        parent.parent().removeClass(move_class + right_postfix);
                    } else if (S(this).parent().hasClass("has-submenu")) {
                        e.preventDefault();
                        S(this).siblings(".left-submenu").toggleClass(move_class + right_postfix);
                    } else if (parent.hasClass("back")) {
                        e.preventDefault();
                        parent.parent().removeClass(move_class + right_postfix);
                    }
                    $('.left-off-canvas-toggle').attr('aria-expanded', 'true');
                })
                .on('click.fndtn.offcanvas', '.right-off-canvas-toggle', function(e) {
                    self.click_toggle_class(e, move_class + left_postfix);
                    if (self.settings.open_method !== 'overlap') {
                        S(".right-submenu").removeClass(move_class + left_postfix);
                    }
                    $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
                })
                .on('click.fndtn.offcanvas', '.right-off-canvas-menu a', function(e) {
                    var settings = self.get_settings(e);
                    var parent = S(this).parent();

                    if (settings.close_on_click && !parent.hasClass("has-submenu") && !parent.hasClass("back")) {
                        self.hide.call(self, move_class + left_postfix, self.get_wrapper(e));
                        parent.parent().removeClass(move_class + left_postfix);
                    } else if (S(this).parent().hasClass("has-submenu")) {
                        e.preventDefault();
                        S(this).siblings(".right-submenu").toggleClass(move_class + left_postfix);
                    } else if (parent.hasClass("back")) {
                        e.preventDefault();
                        parent.parent().removeClass(move_class + left_postfix);
                    }
                    $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
                })
                .on('click.fndtn.offcanvas', '.exit-off-canvas', function(e) {
                    self.click_remove_class(e, move_class + left_postfix);
                    S(".right-submenu").removeClass(move_class + left_postfix);
                    if (right_postfix) {
                        self.click_remove_class(e, move_class + right_postfix);
                        S(".left-submenu").removeClass(move_class + left_postfix);
                    }
                    $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
                })
                .on('click.fndtn.offcanvas', '.exit-off-canvas', function(e) {
                    self.click_remove_class(e, move_class + left_postfix);
                    $('.left-off-canvas-toggle').attr('aria-expanded', 'false');
                    if (right_postfix) {
                        self.click_remove_class(e, move_class + right_postfix);
                        $('.right-off-canvas-toggle').attr('aria-expanded', "false");
                    }
                });
        },

        toggle: function(class_name, $off_canvas) {
            $off_canvas = $off_canvas || this.get_wrapper();
            if ($off_canvas.is('.' + class_name)) {
                this.hide(class_name, $off_canvas);
            } else {
                this.show(class_name, $off_canvas);
            }
        },

        show: function(class_name, $off_canvas) {
            $off_canvas = $off_canvas || this.get_wrapper();
            $off_canvas.trigger('open').trigger('open.fndtn.offcanvas');
            $off_canvas.addClass(class_name);
        },

        hide: function(class_name, $off_canvas) {
            $off_canvas = $off_canvas || this.get_wrapper();
            $off_canvas.trigger('close').trigger('close.fndtn.offcanvas');
            $off_canvas.removeClass(class_name);
        },

        click_toggle_class: function(e, class_name) {
            e.preventDefault();
            var $off_canvas = this.get_wrapper(e);
            this.toggle(class_name, $off_canvas);
        },

        click_remove_class: function(e, class_name) {
            e.preventDefault();
            var $off_canvas = this.get_wrapper(e);
            this.hide(class_name, $off_canvas);
        },

        get_settings: function(e) {
            var offcanvas = this.S(e.target).closest('[' + this.attr_name() + ']');
            return offcanvas.data(this.attr_name(true) + '-init') || this.settings;
        },

        get_wrapper: function(e) {
            var $off_canvas = this.S(e ? e.target : this.scope).closest('.off-canvas-wrap');

            if ($off_canvas.length === 0) {
                $off_canvas = this.S('.off-canvas-wrap');
            }
            return $off_canvas;
        },

        reflow: function() {}
    };
}(jQuery, window, window.document));

;
(function($, window, document, undefined) {
    'use strict';

    Foundation.libs.reveal = {
        name: 'reveal',

        version: '5.4.6',

        locked: false,

        settings: {
            animation: 'fadeAndPop',
            animation_speed: 250,
            close_on_background_click: true,
            close_on_esc: true,
            dismiss_modal_class: 'close-reveal-modal',
            bg_class: 'reveal-modal-bg',
            root_element: 'body',
            open: function() {},
            opened: function() {},
            close: function() {},
            closed: function() {},
            bg: $('.reveal-modal-bg'),
            css: {
                open: {
                    'opacity': 0,
                    'visibility': 'visible',
                    'display': 'block'
                },
                close: {
                    'opacity': 1,
                    'visibility': 'hidden',
                    'display': 'none'
                }
            }
        },

        init: function(scope, method, options) {
            $.extend(true, this.settings, method, options);
            this.bindings(method, options);
        },

        events: function(scope) {
            var self = this,
                S = self.S;

            S(this.scope)
                .off('.reveal')
                .on('click.fndtn.reveal', '[' + this.add_namespace('data-reveal-id') + ']:not([disabled])', function(e) {
                    e.preventDefault();

                    if (!self.locked) {
                        var element = S(this),
                            ajax = element.data(self.data_attr('reveal-ajax'));

                        self.locked = true;

                        if (typeof ajax === 'undefined') {
                            self.open.call(self, element);
                        } else {
                            var url = ajax === true ? element.attr('href') : ajax;

                            self.open.call(self, element, { url: url });
                        }
                    }
                });

            S(document)
                .on('click.fndtn.reveal', this.close_targets(), function(e) {

                    e.preventDefault();

                    if (!self.locked) {
                        var settings = S('[' + self.attr_name() + '].open').data(self.attr_name(true) + '-init'),
                            bg_clicked = S(e.target)[0] === S('.' + settings.bg_class)[0];

                        if (bg_clicked) {
                            if (settings.close_on_background_click) {
                                e.stopPropagation();
                            } else {
                                return;
                            }
                        }

                        self.locked = true;
                        self.close.call(self, bg_clicked ? S('[' + self.attr_name() + '].open') : S(this).closest('[' + self.attr_name() + ']'));
                    }
                });

            if (S('[' + self.attr_name() + ']', this.scope).length > 0) {
                S(this.scope)
                    // .off('.reveal')
                    .on('open.fndtn.reveal', this.settings.open)
                    .on('opened.fndtn.reveal', this.settings.opened)
                    .on('opened.fndtn.reveal', this.open_video)
                    .on('close.fndtn.reveal', this.settings.close)
                    .on('closed.fndtn.reveal', this.settings.closed)
                    .on('closed.fndtn.reveal', this.close_video);
            } else {
                S(this.scope)
                    // .off('.reveal')
                    .on('open.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.open)
                    .on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.opened)
                    .on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.open_video)
                    .on('close.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.close)
                    .on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.closed)
                    .on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.close_video);
            }

            return true;
        },

        // PATCH #3: turning on key up capture only when a reveal window is open
        key_up_on: function(scope) {
            var self = this;

            // PATCH #1: fixing multiple keyup event trigger from single key press
            self.S('body').off('keyup.fndtn.reveal').on('keyup.fndtn.reveal', function(event) {
                var open_modal = self.S('[' + self.attr_name() + '].open'),
                    settings = open_modal.data(self.attr_name(true) + '-init') || self.settings;
                // PATCH #2: making sure that the close event can be called only while unlocked,
                //           so that multiple keyup.fndtn.reveal events don't prevent clean closing of the reveal window.
                if (settings && event.which === 27 && settings.close_on_esc && !self.locked) { // 27 is the keycode for the Escape key
                    self.close.call(self, open_modal);
                }
            });

            return true;
        },

        // PATCH #3: turning on key up capture only when a reveal window is open
        key_up_off: function(scope) {
            this.S('body').off('keyup.fndtn.reveal');
            return true;
        },


        open: function(target, ajax_settings) {
            var self = this,
                modal;

            if (target) {
                if (typeof target.selector !== 'undefined') {
                    // Find the named node; only use the first one found, since the rest of the code assumes there's only one node
                    modal = self.S('#' + target.data(self.data_attr('reveal-id'))).first();
                } else {
                    modal = self.S(this.scope);

                    ajax_settings = target;
                }
            } else {
                modal = self.S(this.scope);
            }

            var settings = modal.data(self.attr_name(true) + '-init');
            settings = settings || this.settings;


            if (modal.hasClass('open') && target.attr('data-reveal-id') == modal.attr('id')) {
                return self.close(modal);
            }

            if (!modal.hasClass('open')) {
                var open_modal = self.S('[' + self.attr_name() + '].open');

                if (typeof modal.data('css-top') === 'undefined') {
                    modal.data('css-top', parseInt(modal.css('top'), 10))
                        .data('offset', this.cache_offset(modal));
                }

                this.key_up_on(modal); // PATCH #3: turning on key up capture only when a reveal window is open
                modal.trigger('open').trigger('open.fndtn.reveal');

                if (open_modal.length < 1) {
                    this.toggle_bg(modal, true);
                }

                if (typeof ajax_settings === 'string') {
                    ajax_settings = {
                        url: ajax_settings
                    };
                }

                if (typeof ajax_settings === 'undefined' || !ajax_settings.url) {
                    if (open_modal.length > 0) {
                        this.hide(open_modal, settings.css.close);
                    }

                    this.show(modal, settings.css.open);
                } else {
                    var old_success = typeof ajax_settings.success !== 'undefined' ? ajax_settings.success : null;

                    $.extend(ajax_settings, {
                        success: function(data, textStatus, jqXHR) {
                            if ($.isFunction(old_success)) {
                                old_success(data, textStatus, jqXHR);
                            }

                            modal.html(data);
                            self.S(modal).foundation('section', 'reflow');
                            self.S(modal).children().foundation();

                            if (open_modal.length > 0) {
                                self.hide(open_modal, settings.css.close);
                            }
                            self.show(modal, settings.css.open);
                        }
                    });

                    $.ajax(ajax_settings);
                }
            }
            self.S(window).trigger('resize');
        },

        close: function(modal) {
            var modal = modal && modal.length ? modal : this.S(this.scope),
                open_modals = this.S('[' + this.attr_name() + '].open'),
                settings = modal.data(this.attr_name(true) + '-init') || this.settings;

            if (open_modals.length > 0) {
                this.locked = true;
                this.key_up_off(modal); // PATCH #3: turning on key up capture only when a reveal window is open
                modal.trigger('close').trigger('close.fndtn.reveal');
                this.toggle_bg(modal, false);
                this.hide(open_modals, settings.css.close, settings);
            }
        },

        close_targets: function() {
            var base = '.' + this.settings.dismiss_modal_class;

            if (this.settings.close_on_background_click) {
                return base + ', .' + this.settings.bg_class;
            }

            return base;
        },

        toggle_bg: function(modal, state) {
            if (this.S('.' + this.settings.bg_class).length === 0) {
                this.settings.bg = $('<div />', { 'class': this.settings.bg_class })
                    .appendTo('body').hide();
            }

            var visible = this.settings.bg.filter(':visible').length > 0;
            if (state != visible) {
                if (state == undefined ? visible : !state) {
                    this.hide(this.settings.bg);
                } else {
                    this.show(this.settings.bg);
                }
            }
        },

        show: function(el, css) {
            // is modal
            if (css) {
                var settings = el.data(this.attr_name(true) + '-init') || this.settings,
                    root_element = settings.root_element;

                if (el.parent(root_element).length === 0) {
                    var placeholder = el.wrap('<div style="display: none;" />').parent();

                    el.on('closed.fndtn.reveal.wrapped', function() {
                        el.detach().appendTo(placeholder);
                        el.unwrap().unbind('closed.fndtn.reveal.wrapped');
                    });

                    el.detach().appendTo(root_element);
                }

                var animData = getAnimationData(settings.animation);
                if (!animData.animate) {
                    this.locked = false;
                }
                if (animData.pop) {
                    css.top = $(window).scrollTop() - el.data('offset') + 'px';
                    var end_css = {
                        top: $(window).scrollTop() + el.data('css-top') + 'px',
                        opacity: 1
                    };

                    return setTimeout(function() {
                        return el
                            .css(css)
                            .animate(end_css, settings.animation_speed, 'linear', function() {
                                this.locked = false;
                                el.trigger('opened').trigger('opened.fndtn.reveal');
                            }.bind(this))
                            .addClass('open');
                    }.bind(this), settings.animation_speed / 2);
                }

                if (animData.fade) {
                    css.top = $(window).scrollTop() + el.data('css-top') + 'px';
                    var end_css = { opacity: 1 };

                    return setTimeout(function() {
                        return el
                            .css(css)
                            .animate(end_css, settings.animation_speed, 'linear', function() {
                                this.locked = false;
                                el.trigger('opened').trigger('opened.fndtn.reveal');
                            }.bind(this))
                            .addClass('open');
                    }.bind(this), settings.animation_speed / 2);
                }

                return el.css(css).show().css({ opacity: 1 }).addClass('open').trigger('opened').trigger('opened.fndtn.reveal');
            }

            var settings = this.settings;

            // should we animate the background?
            if (getAnimationData(settings.animation).fade) {
                return el.fadeIn(settings.animation_speed / 2);
            }

            this.locked = false;

            return el.show();
        },

        hide: function(el, css) {
            // is modal
            if (css) {
                var settings = el.data(this.attr_name(true) + '-init');
                settings = settings || this.settings;

                var animData = getAnimationData(settings.animation);
                if (!animData.animate) {
                    this.locked = false;
                }
                if (animData.pop) {
                    var end_css = {
                        top: -$(window).scrollTop() - el.data('offset') + 'px',
                        opacity: 0
                    };

                    return setTimeout(function() {
                        return el
                            .animate(end_css, settings.animation_speed, 'linear', function() {
                                this.locked = false;
                                el.css(css).trigger('closed').trigger('closed.fndtn.reveal');
                            }.bind(this))
                            .removeClass('open');
                    }.bind(this), settings.animation_speed / 2);
                }

                if (animData.fade) {
                    var end_css = { opacity: 0 };

                    return setTimeout(function() {
                        return el
                            .animate(end_css, settings.animation_speed, 'linear', function() {
                                this.locked = false;
                                el.css(css).trigger('closed').trigger('closed.fndtn.reveal');
                            }.bind(this))
                            .removeClass('open');
                    }.bind(this), settings.animation_speed / 2);
                }

                return el.hide().css(css).removeClass('open').trigger('closed').trigger('closed.fndtn.reveal');
            }

            var settings = this.settings;

            // should we animate the background?
            if (getAnimationData(settings.animation).fade) {
                return el.fadeOut(settings.animation_speed / 2);
            }

            return el.hide();
        },

        close_video: function(e) {
            var video = $('.flex-video', e.target),
                iframe = $('iframe', video);

            if (iframe.length > 0) {
                iframe.attr('data-src', iframe[0].src);
                iframe.attr('src', iframe.attr('src'));
                video.hide();
            }
        },

        open_video: function(e) {
            var video = $('.flex-video', e.target),
                iframe = video.find('iframe');

            if (iframe.length > 0) {
                var data_src = iframe.attr('data-src');
                if (typeof data_src === 'string') {
                    iframe[0].src = iframe.attr('data-src');
                } else {
                    var src = iframe[0].src;
                    iframe[0].src = undefined;
                    iframe[0].src = src;
                }
                video.show();
            }
        },

        data_attr: function(str) {
            if (this.namespace.length > 0) {
                return this.namespace + '-' + str;
            }

            return str;
        },

        cache_offset: function(modal) {
            var offset = modal.show().height() + parseInt(modal.css('top'), 10);

            modal.hide();

            return offset;
        },

        off: function() {
            $(this.scope).off('.fndtn.reveal');
        },

        reflow: function() {}
    };

    /*
     * getAnimationData('popAndFade') // {animate: true,  pop: true,  fade: true}
     * getAnimationData('fade')       // {animate: true,  pop: false, fade: true}
     * getAnimationData('pop')        // {animate: true,  pop: true,  fade: false}
     * getAnimationData('foo')        // {animate: false, pop: false, fade: false}
     * getAnimationData(null)         // {animate: false, pop: false, fade: false}
     */
    function getAnimationData(str) {
        var fade = /fade/i.test(str);
        var pop = /pop/i.test(str);
        return {
            animate: fade || pop,
            pop: pop,
            fade: fade
        };
    }
}(jQuery, window, window.document));

;
(function($, window, document, undefined) {
    'use strict';

    Foundation.libs.tab = {
        name: 'tab',

        version: '5.4.6',

        settings: {
            active_class: 'active',
            callback: function() {},
            deep_linking: false,
            scroll_to_content: true,
            is_hover: false
        },

        default_tab_hashes: [],

        init: function(scope, method, options) {
            var self = this,
                S = this.S;

            this.bindings(method, options);
            this.handle_location_hash_change();

            // Store the default active tabs which will be referenced when the
            // location hash is absent, as in the case of navigating the tabs and
            // returning to the first viewing via the browser Back button.
            S('[' + this.attr_name() + '] > .active > a', this.scope).each(function() {
                self.default_tab_hashes.push(this.hash);
            });
        },

        events: function() {
            var self = this,
                S = this.S;

            var usual_tab_behavior = function(e) {
                var settings = S(this).closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
                if (!settings.is_hover || Modernizr.touch) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.toggle_active_tab(S(this).parent());
                }
            };

            S(this.scope)
                .off('.tab')
                // Click event: tab title
                .on('focus.fndtn.tab', '[' + this.attr_name() + '] > * > a', usual_tab_behavior)
                .on('click.fndtn.tab', '[' + this.attr_name() + '] > * > a', usual_tab_behavior)
                // Hover event: tab title
                .on('mouseenter.fndtn.tab', '[' + this.attr_name() + '] > * > a', function(e) {
                    var settings = S(this).closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
                    if (settings.is_hover) self.toggle_active_tab(S(this).parent());
                });

            // Location hash change event
            S(window).on('hashchange.fndtn.tab', function(e) {
                e.preventDefault();
                self.handle_location_hash_change();
            });
        },

        handle_location_hash_change: function() {

            var self = this,
                S = this.S;

            S('[' + this.attr_name() + ']', this.scope).each(function() {
                var settings = S(this).data(self.attr_name(true) + '-init');
                if (settings.deep_linking) {
                    // Match the location hash to a label
                    var hash;
                    if (settings.scroll_to_content) {
                        hash = self.scope.location.hash;
                    } else {
                        // prefix the hash to prevent anchor scrolling
                        hash = self.scope.location.hash.replace('fndtn-', '');
                    }
                    if (hash != '') {
                        // Check whether the location hash references a tab content div or
                        // another element on the page (inside or outside the tab content div)
                        var hash_element = S(hash);
                        if (hash_element.hasClass('content') && hash_element.parent().hasClass('tab-content')) {
                            // Tab content div
                            self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=' + hash + ']').parent());
                        } else {
                            // Not the tab content div. If inside the tab content, find the
                            // containing tab and toggle it as active.
                            var hash_tab_container_id = hash_element.closest('.content').attr('id');
                            if (hash_tab_container_id != undefined) {
                                self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=#' + hash_tab_container_id + ']').parent(), hash);
                            }
                        }
                    } else {
                        // Reference the default tab hashes which were initialized in the init function
                        for (var ind = 0; ind < self.default_tab_hashes.length; ind++) {
                            self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=' + self.default_tab_hashes[ind] + ']').parent());
                        }
                    }
                }
            });
        },

        toggle_active_tab: function(tab, location_hash) {
            var S = this.S,
                tabs = tab.closest('[' + this.attr_name() + ']'),
                tab_link = tab.find('a'),
                anchor = tab.children('a').first(),
                target_hash = '#' + anchor.attr('href').split('#')[1],
                target = S(target_hash),
                siblings = tab.siblings(),
                settings = tabs.data(this.attr_name(true) + '-init'),
                interpret_keyup_action = function(e) {
                    // Light modification of Heydon Pickering's Practical ARIA Examples: http://heydonworks.com/practical_aria_examples/js/a11y.js 

                    // define current, previous and next (possible) tabs

                    var $original = $(this);
                    var $prev = $(this).parents('li').prev().children('[role="tab"]');
                    var $next = $(this).parents('li').next().children('[role="tab"]');
                    var $target;

                    // find the direction (prev or next)

                    switch (e.keyCode) {
                        case 37:
                            $target = $prev;
                            break;
                        case 39:
                            $target = $next;
                            break;
                        default:
                            $target = false
                            break;
                    }

                    if ($target.length) {
                        $original.attr({
                            'tabindex': '-1',
                            'aria-selected': null
                        });
                        $target.attr({
                            'tabindex': '0',
                            'aria-selected': true
                        }).focus();
                    }

                    // Hide panels

                    $('[role="tabpanel"]')
                        .attr('aria-hidden', 'true');

                    // Show panel which corresponds to target

                    $('#' + $(document.activeElement).attr('href').substring(1))
                        .attr('aria-hidden', null);

                };

            // allow usage of data-tab-content attribute instead of href
            if (S(this).data(this.data_attr('tab-content'))) {
                target_hash = '#' + S(this).data(this.data_attr('tab-content')).split('#')[1];
                target = S(target_hash);
            }

            if (settings.deep_linking) {

                if (settings.scroll_to_content) {
                    // retain current hash to scroll to content
                    window.location.hash = location_hash || target_hash;
                    if (location_hash == undefined || location_hash == target_hash) {
                        tab.parent()[0].scrollIntoView();
                    } else {
                        S(target_hash)[0].scrollIntoView();
                    }
                } else {
                    // prefix the hashes so that the browser doesn't scroll down
                    if (location_hash != undefined) {
                        window.location.hash = 'fndtn-' + location_hash.replace('#', '');
                    } else {
                        window.location.hash = 'fndtn-' + target_hash.replace('#', '');
                    }
                }
            }

            // WARNING: The activation and deactivation of the tab content must
            // occur after the deep linking in order to properly refresh the browser
            // window (notably in Chrome).
            // Clean up multiple attr instances to done once
            tab.addClass(settings.active_class).triggerHandler('opened');
            tab_link.attr({ "aria-selected": "true", tabindex: 0 });
            siblings.removeClass(settings.active_class)
            siblings.find('a').attr({ "aria-selected": "false", tabindex: -1 });
            target.siblings().removeClass(settings.active_class).attr({ "aria-hidden": "true", tabindex: -1 });
            target.addClass(settings.active_class).attr('aria-hidden', 'false').removeAttr("tabindex");
            settings.callback(tab);
            target.triggerHandler('toggled', [tab]);
            tabs.triggerHandler('toggled', [target]);

            tab_link.off('keydown').on('keydown', interpret_keyup_action);
        },

        data_attr: function(str) {
            if (this.namespace.length > 0) {
                return this.namespace + '-' + str;
            }

            return str;
        },

        off: function() {},

        reflow: function() {}
    };
}(jQuery, window, window.document));

;
(function($, window, document, undefined) {
    'use strict';

    Foundation.libs.accordion = {
        name: 'accordion',

        version: '5.4.6',

        settings: {
            active_class: 'active',
            multi_expand: false,
            toggleable: true,
            callback: function() {}
        },

        init: function(scope, method, options) {
            this.bindings(method, options);
        },

        events: function() {
            var self = this;
            var S = this.S;
            S(this.scope)
                .off('.fndtn.accordion')
                .on('click.fndtn.accordion', '[' + this.attr_name() + '] > dd > a', function(e) {
                    var accordion = S(this).closest('[' + self.attr_name() + ']'),
                        groupSelector = self.attr_name() + '=' + accordion.attr(self.attr_name()),
                        settings = accordion.data(self.attr_name(true) + '-init'),
                        target = S('#' + this.href.split('#')[1]),
                        aunts = $('> dd', accordion),
                        siblings = aunts.children('.content'),
                        active_content = siblings.filter('.' + settings.active_class);
                    e.preventDefault();

                    if (accordion.attr(self.attr_name())) {
                        siblings = siblings.add('[' + groupSelector + '] dd > .content');
                        aunts = aunts.add('[' + groupSelector + '] dd');
                    }

                    if (settings.toggleable && target.is(active_content)) {
                        target.parent('dd').toggleClass(settings.active_class, false);
                        target.toggleClass(settings.active_class, false);
                        settings.callback(target);
                        target.triggerHandler('toggled', [accordion]);
                        accordion.triggerHandler('toggled', [target]);
                        return;
                    }

                    if (!settings.multi_expand) {
                        siblings.removeClass(settings.active_class);
                        aunts.removeClass(settings.active_class);
                    }

                    target.addClass(settings.active_class).parent().addClass(settings.active_class);
                    settings.callback(target);
                    target.triggerHandler('toggled', [accordion]);
                    accordion.triggerHandler('toggled', [target]);
                });
        },

        off: function() {},

        reflow: function() {}
    };
}(jQuery, window, window.document));

;
(function($, window, document, undefined) {
    'use strict';

    Foundation.libs.equalizer = {
        name: 'equalizer',

        version: '5.4.6',

        settings: {
            use_tallest: true,
            before_height_change: $.noop,
            after_height_change: $.noop,
            equalize_on_stack: false
        },

        init: function(scope, method, options) {
            Foundation.inherit(this, 'image_loaded');
            this.bindings(method, options);
            this.reflow();
        },

        events: function() {
            this.S(window).off('.equalizer').on('resize.fndtn.equalizer', function(e) {
                this.reflow();
            }.bind(this));
        },

        equalize: function(equalizer) {
            var isStacked = false,
                vals = equalizer.find('[' + this.attr_name() + '-watch]:visible'),
                settings = equalizer.data(this.attr_name(true) + '-init');

            if (vals.length === 0) return;
            var firstTopOffset = vals.first().offset().top;
            settings.before_height_change();
            equalizer.trigger('before-height-change').trigger('before-height-change.fndth.equalizer');
            vals.height('inherit');
            vals.each(function() {
                var el = $(this);
                if (el.offset().top !== firstTopOffset) {
                    isStacked = true;
                }
            });

            if (settings.equalize_on_stack === false) {
                if (isStacked) return;
            };

            var heights = vals.map(function() { return $(this).outerHeight(false) }).get();

            if (settings.use_tallest) {
                var max = Math.max.apply(null, heights);
                vals.css('height', max);
            } else {
                var min = Math.min.apply(null, heights);
                vals.css('height', min);
            }
            settings.after_height_change();
            equalizer.trigger('after-height-change').trigger('after-height-change.fndtn.equalizer');
        },

        reflow: function() {
            var self = this;

            this.S('[' + this.attr_name() + ']', this.scope).each(function() {
                var $eq_target = $(this);
                self.image_loaded(self.S('img', this), function() {
                    self.equalize($eq_target)
                });
            });
        }
    };
})(jQuery, window, window.document);


/*!
 * Parsleyjs
 * Guillaume Potier - <guillaume@wisembly.com>
 * Version 2.0.5 - built Thu Aug 28 2014 11:27:36
 * MIT Licensed
 *
 */
!(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module depending on jQuery.
        define(['jquery'], factory);
    } else {
        // No AMD. Register plugin with global jQuery object.
        factory(jQuery);
    }
}(function($) {
    // small hack for requirejs if jquery is loaded through map and not path
    // see http://requirejs.org/docs/jquery.html
    if ('undefined' === typeof $ && 'undefined' !== typeof window.jQuery)
        $ = window.jQuery;
    var ParsleyUtils = {
        // Parsley DOM-API
        // returns object from dom attributes and values
        // if attr is given, returns bool if attr present in DOM or not
        attr: function($element, namespace, checkAttr) {
            var
                attribute,
                obj = {},
                msie = this.msieversion(),
                regex = new RegExp('^' + namespace, 'i');
            if ('undefined' === typeof $element || 'undefined' === typeof $element[0])
                return {};
            for (var i in $element[0].attributes) {
                attribute = $element[0].attributes[i];
                if ('undefined' !== typeof attribute && null !== attribute && (!msie || msie >= 8 || attribute.specified) && regex.test(attribute.name)) {
                    if ('undefined' !== typeof checkAttr && new RegExp(checkAttr + '$', 'i').test(attribute.name))
                        return true;
                    obj[this.camelize(attribute.name.replace(namespace, ''))] = this.deserializeValue(attribute.value);
                }
            }
            return 'undefined' === typeof checkAttr ? obj : false;
        },
        setAttr: function($element, namespace, attr, value) {
            $element[0].setAttribute(this.dasherize(namespace + attr), String(value));
        },
        // Recursive object / array getter
        get: function(obj, path) {
            var
                i = 0,
                paths = (path || '').split('.');
            while (this.isObject(obj) || this.isArray(obj)) {
                obj = obj[paths[i++]];
                if (i === paths.length)
                    return obj;
            }
            return undefined;
        },
        hash: function(length) {
            return String(Math.random()).substring(2, length ? length + 2 : 9);
        },
        /** Third party functions **/
        // Underscore isArray
        isArray: function(mixed) {
            return Object.prototype.toString.call(mixed) === '[object Array]';
        },
        // Underscore isObject
        isObject: function(mixed) {
            return mixed === Object(mixed);
        },
        // Zepto deserialize function
        deserializeValue: function(value) {
            var num;
            try {
                return value ?
                    value == "true" ||
                    (value == "false" ? false :
                        value == "null" ? null :
                        !isNaN(num = Number(value)) ? num :
                        /^[\[\{]/.test(value) ? $.parseJSON(value) :
                        value) :
                    value;
            } catch (e) { return value; }
        },
        // Zepto camelize function
        camelize: function(str) {
            return str.replace(/-+(.)?/g, function(match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
        },
        // Zepto dasherize function
        dasherize: function(str) {
            return str.replace(/::/g, 'index.html')
                .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
                .replace(/([a-z\d])([A-Z])/g, '$1_$2')
                .replace(/_/g, '-')
                .toLowerCase();
        },
        // http://support.microsoft.com/kb/167820
        // http://stackoverflow.com/questions/19999388/jquery-check-if-user-is-using-ie
        msieversion: function() {
            var
                ua = window.navigator.userAgent,
                msie = ua.indexOf('MSIE ');
            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            return 0;
        }
    };
    // All these options could be overriden and specified directly in DOM using
    // `data-parsley-` default DOM-API
    // eg: `inputs` can be set in DOM using `data-parsley-inputs="input, textarea"`
    // eg: `data-parsley-stop-on-first-failing-constraint="false"`
    var ParsleyDefaults = {
        // ### General
        // Default data-namespace for DOM API
        namespace: 'data-parsley-',
        // Supported inputs by default
        inputs: 'input, textarea, select',
        // Excluded inputs by default
        excluded: 'input[type=button], input[type=submit], input[type=reset], input[type=hidden]',
        // Stop validating field on highest priority failing constraint
        priorityEnabled: true,
        // ### UI
        // Enable\Disable error messages
        uiEnabled: true,
        // Key events threshold before validation
        validationThreshold: 3,
        // Focused field on form validation error. 'fist'|'last'|'none'
        focus: 'first',
        // `$.Event()` that will trigger validation. eg: `keyup`, `change`..
        trigger: false,
        // Class that would be added on every failing validation Parsley field
        errorClass: 'parsley-error',
        // Same for success validation
        successClass: 'parsley-success',
        // Return the `$element` that will receive these above success or error classes
        // Could also be (and given directly from DOM) a valid selector like `'#div'`
        classHandler: function(ParsleyField) {},
        // Return the `$element` where errors will be appended
        // Could also be (and given directly from DOM) a valid selector like `'#div'`
        errorsContainer: function(ParsleyField) {},
        // ul elem that would receive errors' list
        errorsWrapper: '<ul class="parsley-errors-list"></ul>',
        // li elem that would receive error message
        errorTemplate: '<li></li>'
    };

    var ParsleyAbstract = function() {};
    ParsleyAbstract.prototype = {
        asyncSupport: false,
        actualizeOptions: function() {
            this.options = this.OptionsFactory.get(this);
            return this;
        },
        // ParsleyValidator validate proxy function . Could be replaced by third party scripts
        validateThroughValidator: function(value, constraints, priority) {
            return window.ParsleyValidator.validate.apply(window.ParsleyValidator, [value, constraints, priority]);
        },
        // Subscribe an event and a handler for a specific field or a specific form
        // If on a ParsleyForm instance, it will be attached to form instance and also
        // To every field instance for this form
        subscribe: function(name, fn) {
            $.listenTo(this, name.toLowerCase(), fn);
            return this;
        },
        // Same as subscribe above. Unsubscribe an event for field, or form + its fields
        unsubscribe: function(name) {
            $.unsubscribeTo(this, name.toLowerCase());
            return this;
        },
        // Reset UI
        reset: function() {
            // Field case: just emit a reset event for UI
            if ('ParsleyForm' !== this.__class__)
                return $.emit('parsley:field:reset', this);
            // Form case: emit a reset event for each field
            for (var i = 0; i < this.fields.length; i++)
                $.emit('parsley:field:reset', this.fields[i]);
            $.emit('parsley:form:reset', this);
        },
        // Destroy Parsley instance (+ UI)
        destroy: function() {
            // Field case: emit destroy event to clean UI and then destroy stored instance
            if ('ParsleyForm' !== this.__class__) {
                this.$element.removeData('Parsley');
                this.$element.removeData('ParsleyFieldMultiple');
                $.emit('parsley:field:destroy', this);
                return;
            }
            // Form case: destroy all its fields and then destroy stored instance
            for (var i = 0; i < this.fields.length; i++)
                this.fields[i].destroy();
            this.$element.removeData('Parsley');
            $.emit('parsley:form:destroy', this);
        }
    };
    /*!
     * validator.js
     * Guillaume Potier - <guillaume@wisembly.com>
     * Version 1.0.0 - built Sun Aug 03 2014 17:42:31
     * MIT Licensed
     *
     */
    var Validator = (function() {
        var exports = {};
        /**
         * Validator
         */
        var Validator = function(options) {
            this.__class__ = 'Validator';
            this.__version__ = '1.0.0';
            this.options = options || {};
            this.bindingKey = this.options.bindingKey || '_validatorjsConstraint';
        };
        Validator.prototype = {
            constructor: Validator,
            /*
             * Validate string: validate( string, Assert, string ) || validate( string, [ Assert, Assert ], [ string, string ] )
             * Validate object: validate( object, Constraint, string ) || validate( object, Constraint, [ string, string ] )
             * Validate binded object: validate( object, string ) || validate( object, [ string, string ] )
             */
            validate: function(objectOrString, AssertsOrConstraintOrGroup, group) {
                if ('string' !== typeof objectOrString && 'object' !== typeof objectOrString)
                    throw new Error('You must validate an object or a string');
                // string / array validation
                if ('string' === typeof objectOrString || _isArray(objectOrString))
                    return this._validateString(objectOrString, AssertsOrConstraintOrGroup, group);
                // binded object validation
                if (this.isBinded(objectOrString))
                    return this._validateBindedObject(objectOrString, AssertsOrConstraintOrGroup);
                // regular object validation
                return this._validateObject(objectOrString, AssertsOrConstraintOrGroup, group);
            },
            bind: function(object, constraint) {
                if ('object' !== typeof object)
                    throw new Error('Must bind a Constraint to an object');
                object[this.bindingKey] = new Constraint(constraint);
                return this;
            },
            unbind: function(object) {
                if ('undefined' === typeof object._validatorjsConstraint)
                    return this;
                delete object[this.bindingKey];
                return this;
            },
            isBinded: function(object) {
                return 'undefined' !== typeof object[this.bindingKey];
            },
            getBinded: function(object) {
                return this.isBinded(object) ? object[this.bindingKey] : null;
            },
            _validateString: function(string, assert, group) {
                var result, failures = [];
                if (!_isArray(assert))
                    assert = [assert];
                for (var i = 0; i < assert.length; i++) {
                    if (!(assert[i] instanceof Assert))
                        throw new Error('You must give an Assert or an Asserts array to validate a string');
                    result = assert[i].check(string, group);
                    if (result instanceof Violation)
                        failures.push(result);
                }
                return failures.length ? failures : true;
            },
            _validateObject: function(object, constraint, group) {
                if ('object' !== typeof constraint)
                    throw new Error('You must give a constraint to validate an object');
                if (constraint instanceof Constraint)
                    return constraint.check(object, group);
                return new Constraint(constraint).check(object, group);
            },
            _validateBindedObject: function(object, group) {
                return object[this.bindingKey].check(object, group);
            }
        };
        Validator.errorCode = {
            must_be_a_string: 'must_be_a_string',
            must_be_an_array: 'must_be_an_array',
            must_be_a_number: 'must_be_a_number',
            must_be_a_string_or_array: 'must_be_a_string_or_array'
        };
        /**
         * Constraint
         */
        var Constraint = function(data, options) {
            this.__class__ = 'Constraint';
            this.options = options || {};
            this.nodes = {};
            if (data) {
                try {
                    this._bootstrap(data);
                } catch (err) {
                    throw new Error('Should give a valid mapping object to Constraint', err, data);
                }
            }
        };
        Constraint.prototype = {
            constructor: Constraint,
            check: function(object, group) {
                var result, failures = {};
                // check all constraint nodes.
                for (var property in this.nodes) {
                    var isRequired = false;
                    var constraint = this.get(property);
                    var constraints = _isArray(constraint) ? constraint : [constraint];
                    for (var i = constraints.length - 1; i >= 0; i--) {
                        if ('Required' === constraints[i].__class__) {
                            isRequired = constraints[i].requiresValidation(group);
                            continue;
                        }
                    }
                    if (!this.has(property, object) && !this.options.strict && !isRequired) {
                        continue;
                    }
                    try {
                        if (!this.has(property, this.options.strict || isRequired ? object : undefined)) {
                            // we trigger here a HaveProperty Assert violation to have uniform Violation object in the end
                            new Assert().HaveProperty(property).validate(object);
                        }
                        result = this._check(property, object[property], group);
                        // check returned an array of Violations or an object mapping Violations
                        if ((_isArray(result) && result.length > 0) || (!_isArray(result) && !_isEmptyObject(result))) {
                            failures[property] = result;
                        }
                    } catch (violation) {
                        failures[property] = violation;
                    }
                }
                return _isEmptyObject(failures) ? true : failures;
            },
            add: function(node, object) {
                if (object instanceof Assert || (_isArray(object) && object[0] instanceof Assert)) {
                    this.nodes[node] = object;
                    return this;
                }
                if ('object' === typeof object && !_isArray(object)) {
                    this.nodes[node] = object instanceof Constraint ? object : new Constraint(object);
                    return this;
                }
                throw new Error('Should give an Assert, an Asserts array, a Constraint', object);
            },
            has: function(node, nodes) {
                nodes = 'undefined' !== typeof nodes ? nodes : this.nodes;
                return 'undefined' !== typeof nodes[node];
            },
            get: function(node, placeholder) {
                return this.has(node) ? this.nodes[node] : placeholder || null;
            },
            remove: function(node) {
                var _nodes = [];
                for (var i in this.nodes)
                    if (i !== node)
                        _nodes[i] = this.nodes[i];
                this.nodes = _nodes;
                return this;
            },
            _bootstrap: function(data) {
                if (data instanceof Constraint)
                    return this.nodes = data.nodes;
                for (var node in data)
                    this.add(node, data[node]);
            },
            _check: function(node, value, group) {
                // Assert
                if (this.nodes[node] instanceof Assert)
                    return this._checkAsserts(value, [this.nodes[node]], group);
                // Asserts
                if (_isArray(this.nodes[node]))
                    return this._checkAsserts(value, this.nodes[node], group);
                // Constraint -> check api
                if (this.nodes[node] instanceof Constraint)
                    return this.nodes[node].check(value, group);
                throw new Error('Invalid node', this.nodes[node]);
            },
            _checkAsserts: function(value, asserts, group) {
                var result, failures = [];
                for (var i = 0; i < asserts.length; i++) {
                    result = asserts[i].check(value, group);
                    if ('undefined' !== typeof result && true !== result)
                        failures.push(result);
                    // Some asserts (Collection for example) could return an object
                    // if ( result && ! ( result instanceof Violation ) )
                    //   return result;
                    //
                    // // Vast assert majority return Violation
                    // if ( result instanceof Violation )
                    //   failures.push( result );
                }
                return failures;
            }
        };
        /**
         * Violation
         */
        var Violation = function(assert, value, violation) {
            this.__class__ = 'Violation';
            if (!(assert instanceof Assert))
                throw new Error('Should give an assertion implementing the Assert interface');
            this.assert = assert;
            this.value = value;
            if ('undefined' !== typeof violation)
                this.violation = violation;
        };
        Violation.prototype = {
            show: function() {
                var show = {
                    assert: this.assert.__class__,
                    value: this.value
                };
                if (this.violation)
                    show.violation = this.violation;
                return show;
            },
            __toString: function() {
                if ('undefined' !== typeof this.violation)
                    this.violation = '", ' + this.getViolation().constraint + ' expected was ' + this.getViolation().expected;
                return this.assert.__class__ + ' assert failed for "' + this.value + this.violation || '';
            },
            getViolation: function() {
                var constraint, expected;
                for (constraint in this.violation)
                    expected = this.violation[constraint];
                return { constraint: constraint, expected: expected };
            }
        };
        /**
         * Assert
         */
        var Assert = function(group) {
            this.__class__ = 'Assert';
            this.__parentClass__ = this.__class__;
            this.groups = [];
            if ('undefined' !== typeof group)
                this.addGroup(group);
        };
        Assert.prototype = {
            construct: Assert,
            requiresValidation: function(group) {
                if (group && !this.hasGroup(group))
                    return false;
                if (!group && this.hasGroups())
                    return false;
                return true;
            },
            check: function(value, group) {
                if (!this.requiresValidation(group))
                    return;
                try {
                    return this.validate(value, group);
                } catch (violation) {
                    return violation;
                }
            },
            hasGroup: function(group) {
                if (_isArray(group))
                    return this.hasOneOf(group);
                // All Asserts respond to "Any" group
                if ('Any' === group)
                    return true;
                // Asserts with no group also respond to "Default" group. Else return false
                if (!this.hasGroups())
                    return 'Default' === group;
                return -1 !== this.groups.indexOf(group);
            },
            hasOneOf: function(groups) {
                for (var i = 0; i < groups.length; i++)
                    if (this.hasGroup(groups[i]))
                        return true;
                return false;
            },
            hasGroups: function() {
                return this.groups.length > 0;
            },
            addGroup: function(group) {
                if (_isArray(group))
                    return this.addGroups(group);
                if (!this.hasGroup(group))
                    this.groups.push(group);
                return this;
            },
            removeGroup: function(group) {
                var _groups = [];
                for (var i = 0; i < this.groups.length; i++)
                    if (group !== this.groups[i])
                        _groups.push(this.groups[i]);
                this.groups = _groups;
                return this;
            },
            addGroups: function(groups) {
                for (var i = 0; i < groups.length; i++)
                    this.addGroup(groups[i]);
                return this;
            },
            /**
             * Asserts definitions
             */
            HaveProperty: function(node) {
                this.__class__ = 'HaveProperty';
                this.node = node;
                this.validate = function(object) {
                    if ('undefined' === typeof object[this.node])
                        throw new Violation(this, object, { value: this.node });
                    return true;
                };
                return this;
            },
            Blank: function() {
                this.__class__ = 'Blank';
                this.validate = function(value) {
                    if ('string' !== typeof value)
                        throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
                    if ('' !== value.replace(/^\s+/g, '').replace(/\s+$/g, ''))
                        throw new Violation(this, value);
                    return true;
                };
                return this;
            },
            Callback: function(fn) {
                this.__class__ = 'Callback';
                this.arguments = Array.prototype.slice.call(arguments);
                if (1 === this.arguments.length)
                    this.arguments = [];
                else
                    this.arguments.splice(0, 1);
                if ('function' !== typeof fn)
                    throw new Error('Callback must be instanciated with a function');
                this.fn = fn;
                this.validate = function(value) {
                    var result = this.fn.apply(this, [value].concat(this.arguments));
                    if (true !== result)
                        throw new Violation(this, value, { result: result });
                    return true;
                };
                return this;
            },
            Choice: function(list) {
                this.__class__ = 'Choice';
                if (!_isArray(list) && 'function' !== typeof list)
                    throw new Error('Choice must be instanciated with an array or a function');
                this.list = list;
                this.validate = function(value) {
                    var list = 'function' === typeof this.list ? this.list() : this.list;
                    for (var i = 0; i < list.length; i++)
                        if (value === list[i])
                            return true;
                    throw new Violation(this, value, { choices: list });
                };
                return this;
            },
            Collection: function(assertOrConstraint) {
                this.__class__ = 'Collection';
                this.constraint = 'undefined' !== typeof assertOrConstraint ? (assertOrConstraint instanceof Assert ? assertOrConstraint : new Constraint(assertOrConstraint)) : false;
                this.validate = function(collection, group) {
                    var result, validator = new Validator(),
                        count = 0,
                        failures = {},
                        groups = this.groups.length ? this.groups : group;
                    if (!_isArray(collection))
                        throw new Violation(this, array, { value: Validator.errorCode.must_be_an_array });
                    for (var i = 0; i < collection.length; i++) {
                        result = this.constraint ?
                            validator.validate(collection[i], this.constraint, groups) :
                            validator.validate(collection[i], groups);
                        if (!_isEmptyObject(result))
                            failures[count] = result;
                        count++;
                    }
                    return !_isEmptyObject(failures) ? failures : true;
                };
                return this;
            },
            Count: function(count) {
                this.__class__ = 'Count';
                this.count = count;
                this.validate = function(array) {
                    if (!_isArray(array))
                        throw new Violation(this, array, { value: Validator.errorCode.must_be_an_array });
                    var count = 'function' === typeof this.count ? this.count(array) : this.count;
                    if (isNaN(Number(count)))
                        throw new Error('Count must be a valid interger', count);
                    if (count !== array.length)
                        throw new Violation(this, array, { count: count });
                    return true;
                };
                return this;
            },
            Email: function() {
                this.__class__ = 'Email';
                this.validate = function(value) {
                    var regExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
                    if ('string' !== typeof value)
                        throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
                    if (!regExp.test(value))
                        throw new Violation(this, value);
                    return true;
                };
                return this;
            },
            EqualTo: function(reference) {
                this.__class__ = 'EqualTo';
                if ('undefined' === typeof reference)
                    throw new Error('EqualTo must be instanciated with a value or a function');
                this.reference = reference;
                this.validate = function(value) {
                    var reference = 'function' === typeof this.reference ? this.reference(value) : this.reference;
                    if (reference !== value)
                        throw new Violation(this, value, { value: reference });
                    return true;
                };
                return this;
            },
            GreaterThan: function(threshold) {
                this.__class__ = 'GreaterThan';
                if ('undefined' === typeof threshold)
                    throw new Error('Should give a threshold value');
                this.threshold = threshold;
                this.validate = function(value) {
                    if ('' === value || isNaN(Number(value)))
                        throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
                    if (this.threshold >= value)
                        throw new Violation(this, value, { threshold: this.threshold });
                    return true;
                };
                return this;
            },
            GreaterThanOrEqual: function(threshold) {
                this.__class__ = 'GreaterThanOrEqual';
                if ('undefined' === typeof threshold)
                    throw new Error('Should give a threshold value');
                this.threshold = threshold;
                this.validate = function(value) {
                    if ('' === value || isNaN(Number(value)))
                        throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
                    if (this.threshold > value)
                        throw new Violation(this, value, { threshold: this.threshold });
                    return true;
                };
                return this;
            },
            InstanceOf: function(classRef) {
                this.__class__ = 'InstanceOf';
                if ('undefined' === typeof classRef)
                    throw new Error('InstanceOf must be instanciated with a value');
                this.classRef = classRef;
                this.validate = function(value) {
                    if (true !== (value instanceof this.classRef))
                        throw new Violation(this, value, { classRef: this.classRef });
                    return true;
                };
                return this;
            },
            Length: function(boundaries) {
                this.__class__ = 'Length';
                if (!boundaries.min && !boundaries.max)
                    throw new Error('Lenth assert must be instanciated with a { min: x, max: y } object');
                this.min = boundaries.min;
                this.max = boundaries.max;
                this.validate = function(value) {
                    if ('string' !== typeof value && !_isArray(value))
                        throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string_or_array });
                    if ('undefined' !== typeof this.min && this.min === this.max && value.length !== this.min)
                        throw new Violation(this, value, { min: this.min, max: this.max });
                    if ('undefined' !== typeof this.max && value.length > this.max)
                        throw new Violation(this, value, { max: this.max });
                    if ('undefined' !== typeof this.min && value.length < this.min)
                        throw new Violation(this, value, { min: this.min });
                    return true;
                };
                return this;
            },
            LessThan: function(threshold) {
                this.__class__ = 'LessThan';
                if ('undefined' === typeof threshold)
                    throw new Error('Should give a threshold value');
                this.threshold = threshold;
                this.validate = function(value) {
                    if ('' === value || isNaN(Number(value)))
                        throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
                    if (this.threshold <= value)
                        throw new Violation(this, value, { threshold: this.threshold });
                    return true;
                };
                return this;
            },
            LessThanOrEqual: function(threshold) {
                this.__class__ = 'LessThanOrEqual';
                if ('undefined' === typeof threshold)
                    throw new Error('Should give a threshold value');
                this.threshold = threshold;
                this.validate = function(value) {
                    if ('' === value || isNaN(Number(value)))
                        throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
                    if (this.threshold < value)
                        throw new Violation(this, value, { threshold: this.threshold });
                    return true;
                };
                return this;
            },
            NotNull: function() {
                this.__class__ = 'NotNull';
                this.validate = function(value) {
                    if (null === value || 'undefined' === typeof value)
                        throw new Violation(this, value);
                    return true;
                };
                return this;
            },
            NotBlank: function() {
                this.__class__ = 'NotBlank';
                this.validate = function(value) {
                    if ('string' !== typeof value)
                        throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
                    if ('' === value.replace(/^\s+/g, '').replace(/\s+$/g, ''))
                        throw new Violation(this, value);
                    return true;
                };
                return this;
            },
            Null: function() {
                this.__class__ = 'Null';
                this.validate = function(value) {
                    if (null !== value)
                        throw new Violation(this, value);
                    return true;
                };
                return this;
            },
            Range: function(min, max) {
                this.__class__ = 'Range';
                if ('undefined' === typeof min || 'undefined' === typeof max)
                    throw new Error('Range assert expects min and max values');
                this.min = min;
                this.max = max;
                this.validate = function(value) {
                    try {
                        // validate strings and objects with their Length
                        if (('string' === typeof value && isNaN(Number(value))) || _isArray(value))
                            new Assert().Length({ min: this.min, max: this.max }).validate(value);
                        // validate numbers with their value
                        else
                            new Assert().GreaterThanOrEqual(this.min).validate(value) && new Assert().LessThanOrEqual(this.max).validate(value);
                        return true;
                    } catch (violation) {
                        throw new Violation(this, value, violation.violation);
                    }
                    return true;
                };
                return this;
            },
            Regexp: function(regexp, flag) {
                this.__class__ = 'Regexp';
                if ('undefined' === typeof regexp)
                    throw new Error('You must give a regexp');
                this.regexp = regexp;
                this.flag = flag || '';
                this.validate = function(value) {
                    if ('string' !== typeof value)
                        throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
                    if (!new RegExp(this.regexp, this.flag).test(value))
                        throw new Violation(this, value, { regexp: this.regexp, flag: this.flag });
                    return true;
                };
                return this;
            },
            Required: function() {
                this.__class__ = 'Required';
                this.validate = function(value) {
                    if ('undefined' === typeof value)
                        throw new Violation(this, value);
                    try {
                        if ('string' === typeof value)
                            new Assert().NotNull().validate(value) && new Assert().NotBlank().validate(value);
                        else if (true === _isArray(value))
                            new Assert().Length({ min: 1 }).validate(value);
                    } catch (violation) {
                        throw new Violation(this, value);
                    }
                    return true;
                };
                return this;
            },
            // Unique() or Unique ( { key: foo } )
            Unique: function(object) {
                this.__class__ = 'Unique';
                if ('object' === typeof object)
                    this.key = object.key;
                this.validate = function(array) {
                    var value, store = [];
                    if (!_isArray(array))
                        throw new Violation(this, array, { value: Validator.errorCode.must_be_an_array });
                    for (var i = 0; i < array.length; i++) {
                        value = 'object' === typeof array[i] ? array[i][this.key] : array[i];
                        if ('undefined' === typeof value)
                            continue;
                        if (-1 !== store.indexOf(value))
                            throw new Violation(this, array, { value: value });
                        store.push(value);
                    }
                    return true;
                };
                return this;
            }
        };
        // expose to the world these awesome classes
        exports.Assert = Assert;
        exports.Validator = Validator;
        exports.Violation = Violation;
        exports.Constraint = Constraint;
        /**
         * Some useful object prototypes / functions here
         */
        // IE8<= compatibility
        // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
        if (!Array.prototype.indexOf)
            Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {

                if (this === null) {
                    throw new TypeError();
                }
                var t = Object(this);
                var len = t.length >>> 0;
                if (len === 0) {
                    return -1;
                }
                var n = 0;
                if (arguments.length > 1) {
                    n = Number(arguments[1]);
                    if (n != n) { // shortcut for verifying if it's NaN
                        n = 0;
                    } else if (n !== 0 && n != Infinity && n != -Infinity) {
                        n = (n > 0 || -1) * Math.floor(Math.abs(n));
                    }
                }
                if (n >= len) {
                    return -1;
                }
                var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
                for (; k < len; k++) {
                    if (k in t && t[k] === searchElement) {
                        return k;
                    }
                }
                return -1;
            };
        // Test if object is empty, useful for Constraint violations check
        var _isEmptyObject = function(obj) {
            for (var property in obj)
                return false;
            return true;
        };
        var _isArray = function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };
        // AMD export
        if (typeof define === 'function' && define.amd) {
            define('vendors/validator.js/dist/validator', [], function() {
                return exports;
            });
            // commonjs export
        } else if (typeof module !== 'undefined' && module.exports) {
            module.exports = exports;
            // browser
        } else {
            window['undefined' !== typeof validatorjs_ns ? validatorjs_ns : 'Validator'] = exports;
        }

        return exports;
    })();

    // This is needed for Browserify usage that requires Validator.js through module.exports
    Validator = 'undefined' !== typeof Validator ? Validator : ('undefined' !== typeof module ? module.exports : null);
    var ParsleyValidator = function(validators, catalog) {
        this.__class__ = 'ParsleyValidator';
        this.Validator = Validator;
        // Default Parsley locale is en
        this.locale = 'en';
        this.init(validators || {}, catalog || {});
    };
    ParsleyValidator.prototype = {
        init: function(validators, catalog) {
            this.catalog = catalog;
            for (var name in validators)
                this.addValidator(name, validators[name].fn, validators[name].priority, validators[name].requirementsTransformer);
            $.emit('parsley:validator:init');
        },
        // Set new messages locale if we have dictionary loaded in ParsleyConfig.i18n
        setLocale: function(locale) {
            if ('undefined' === typeof this.catalog[locale])
                throw new Error(locale + ' is not available in the catalog');
            this.locale = locale;
            return this;
        },
        // Add a new messages catalog for a given locale. Set locale for this catalog if set === `true`
        addCatalog: function(locale, messages, set) {
            if ('object' === typeof messages)
                this.catalog[locale] = messages;
            if (true === set)
                return this.setLocale(locale);
            return this;
        },
        // Add a specific message for a given constraint in a given locale
        addMessage: function(locale, name, message) {
            if ('undefined' === typeof this.catalog[locale])
                this.catalog[locale] = {};
            this.catalog[locale][name.toLowerCase()] = message;
            return this;
        },
        validate: function(value, constraints, priority) {
            return new this.Validator.Validator().validate.apply(new Validator.Validator(), arguments);
        },
        // Add a new validator
        addValidator: function(name, fn, priority, requirementsTransformer) {
            this.validators[name.toLowerCase()] = function(requirements) {
                return $.extend(new Validator.Assert().Callback(fn, requirements), {
                    priority: priority,
                    requirementsTransformer: requirementsTransformer
                });
            };
            return this;
        },
        updateValidator: function(name, fn, priority, requirementsTransformer) {
            return this.addValidator(name, fn, priority, requirementsTransformer);
        },
        removeValidator: function(name) {
            delete this.validators[name];
            return this;
        },
        getErrorMessage: function(constraint) {
            var message;
            // Type constraints are a bit different, we have to match their requirements too to find right error message
            if ('type' === constraint.name)
                message = this.catalog[this.locale][constraint.name][constraint.requirements];
            else
                message = this.formatMessage(this.catalog[this.locale][constraint.name], constraint.requirements);
            return '' !== message ? message : this.catalog[this.locale].defaultMessage;
        },
        // Kind of light `sprintf()` implementation
        formatMessage: function(string, parameters) {
            if ('object' === typeof parameters) {
                for (var i in parameters)
                    string = this.formatMessage(string, parameters[i]);
                return string;
            }
            return 'string' === typeof string ? string.replace(new RegExp('%s', 'i'), parameters) : '';
        },
        // Here is the Parsley default validators list.
        // This is basically Validatorjs validators, with different API for some of them
        // and a Parsley priority set
        validators: {
            notblank: function() {
                return $.extend(new Validator.Assert().NotBlank(), { priority: 2 });
            },
            required: function() {
                return $.extend(new Validator.Assert().Required(), { priority: 512 });
            },
            type: function(type) {
                var assert;
                switch (type) {
                    case 'email':
                        assert = new Validator.Assert().Email();
                        break;
                        // range type just ensure we have a number here
                    case 'range':
                    case 'number':
                        assert = new Validator.Assert().Regexp('^-?(?:\\d+|\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$');
                        break;
                    case 'integer':
                        assert = new Validator.Assert().Regexp('^-?\\d+$');
                        break;
                    case 'digits':
                        assert = new Validator.Assert().Regexp('^\\d+$');
                        break;
                    case 'alphanum':
                        assert = new Validator.Assert().Regexp('^\\w+$', 'i');
                        break;
                    case 'url':
                        assert = new Validator.Assert().Regexp('(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)', 'i');
                        break;
                    default:
                        throw new Error('validator type `' + type + '` is not supported');
                }
                return $.extend(assert, { priority: 256 });
            },
            pattern: function(regexp) {
                var flags = '';
                // Test if RegExp is literal, if not, nothing to be done, otherwise, we need to isolate flags and pattern
                if (!!(/^\/.*\/(?:[gimy]*)$/.test(regexp))) {
                    // Replace the regexp literal string with the first match group: ([gimy]*)
                    // If no flag is present, this will be a blank string
                    flags = regexp.replace(/.*\/([gimy]*)$/, '$1');
                    // Again, replace the regexp literal string with the first match group:
                    // everything excluding the opening and closing slashes and the flags
                    regexp = regexp.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
                }
                return $.extend(new Validator.Assert().Regexp(regexp, flags), { priority: 64 });
            },
            minlength: function(value) {
                return $.extend(new Validator.Assert().Length({ min: value }), {
                    priority: 30,
                    requirementsTransformer: function() {
                        return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
                    }
                });
            },
            maxlength: function(value) {
                return $.extend(new Validator.Assert().Length({ max: value }), {
                    priority: 30,
                    requirementsTransformer: function() {
                        return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
                    }
                });
            },
            length: function(array) {
                return $.extend(new Validator.Assert().Length({ min: array[0], max: array[1] }), { priority: 32 });
            },
            mincheck: function(length) {
                return this.minlength(length);
            },
            maxcheck: function(length) {
                return this.maxlength(length);
            },
            check: function(array) {
                return this.length(array);
            },
            min: function(value) {
                return $.extend(new Validator.Assert().GreaterThanOrEqual(value), {
                    priority: 30,
                    requirementsTransformer: function() {
                        return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
                    }
                });
            },
            max: function(value) {
                return $.extend(new Validator.Assert().LessThanOrEqual(value), {
                    priority: 30,
                    requirementsTransformer: function() {
                        return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
                    }
                });
            },
            range: function(array) {
                return $.extend(new Validator.Assert().Range(array[0], array[1]), {
                    priority: 32,
                    requirementsTransformer: function() {
                        for (var i = 0; i < array.length; i++)
                            array[i] = 'string' === typeof array[i] && !isNaN(array[i]) ? parseInt(array[i], 10) : array[i];
                        return array;
                    }
                });
            },
            equalto: function(value) {
                return $.extend(new Validator.Assert().EqualTo(value), {
                    priority: 256,
                    requirementsTransformer: function() {
                        return $(value).length ? $(value).val() : value;
                    }
                });
            }
        }
    };

    var ParsleyUI = function(options) {
        this.__class__ = 'ParsleyUI';
    };
    ParsleyUI.prototype = {
        listen: function() {
            $.listen('parsley:form:init', this, this.setupForm);
            $.listen('parsley:field:init', this, this.setupField);
            $.listen('parsley:field:validated', this, this.reflow);
            $.listen('parsley:form:validated', this, this.focus);
            $.listen('parsley:field:reset', this, this.reset);
            $.listen('parsley:form:destroy', this, this.destroy);
            $.listen('parsley:field:destroy', this, this.destroy);
            return this;
        },
        reflow: function(fieldInstance) {
            // If this field has not an active UI (case for multiples) don't bother doing something
            if ('undefined' === typeof fieldInstance._ui || false === fieldInstance._ui.active)
                return;
            // Diff between two validation results
            var diff = this._diff(fieldInstance.validationResult, fieldInstance._ui.lastValidationResult);
            // Then store current validation result for next reflow
            fieldInstance._ui.lastValidationResult = fieldInstance.validationResult;
            // Field have been validated at least once if here. Useful for binded key events..
            fieldInstance._ui.validatedOnce = true;
            // Handle valid / invalid / none field class
            this.manageStatusClass(fieldInstance);
            // Add, remove, updated errors messages
            this.manageErrorsMessages(fieldInstance, diff);
            // Triggers impl
            this.actualizeTriggers(fieldInstance);
            // If field is not valid for the first time, bind keyup trigger to ease UX and quickly inform user
            if ((diff.kept.length || diff.added.length) && 'undefined' === typeof fieldInstance._ui.failedOnce)
                this.manageFailingFieldTrigger(fieldInstance);
        },
        // Returns an array of field's error message(s)
        getErrorsMessages: function(fieldInstance) {
            // No error message, field is valid
            if (true === fieldInstance.validationResult)
                return [];
            var messages = [];
            for (var i = 0; i < fieldInstance.validationResult.length; i++)
                messages.push(this._getErrorMessage(fieldInstance, fieldInstance.validationResult[i].assert));
            return messages;
        },
        manageStatusClass: function(fieldInstance) {
            if (true === fieldInstance.validationResult)
                this._successClass(fieldInstance);
            else if (fieldInstance.validationResult.length > 0)
                this._errorClass(fieldInstance);
            else
                this._resetClass(fieldInstance);
        },
        manageErrorsMessages: function(fieldInstance, diff) {
            if ('undefined' !== typeof fieldInstance.options.errorsMessagesDisabled)
                return;
            // Case where we have errorMessage option that configure an unique field error message, regardless failing validators
            if ('undefined' !== typeof fieldInstance.options.errorMessage) {
                if ((diff.added.length || diff.kept.length)) {
                    if (0 === fieldInstance._ui.$errorsWrapper.find('.parsley-custom-error-message').length)
                        fieldInstance._ui.$errorsWrapper
                        .append($(fieldInstance.options.errorTemplate)
                            .addClass('parsley-custom-error-message'));
                    return fieldInstance._ui.$errorsWrapper
                        .addClass('filled')
                        .find('.parsley-custom-error-message')
                        .html(fieldInstance.options.errorMessage);
                }
                return fieldInstance._ui.$errorsWrapper
                    .removeClass('filled')
                    .find('.parsley-custom-error-message')
                    .remove();
            }
            // Show, hide, update failing constraints messages
            for (var i = 0; i < diff.removed.length; i++)
                this.removeError(fieldInstance, diff.removed[i].assert.name, true);
            for (i = 0; i < diff.added.length; i++)
                this.addError(fieldInstance, diff.added[i].assert.name, undefined, diff.added[i].assert, true);
            for (i = 0; i < diff.kept.length; i++)
                this.updateError(fieldInstance, diff.kept[i].assert.name, undefined, diff.kept[i].assert, true);
        },
        // TODO: strange API here, intuitive for manual usage with addError(pslyInstance, 'foo', 'bar')
        // but a little bit complex for above internal usage, with forced undefined parametter..
        addError: function(fieldInstance, name, message, assert, doNotUpdateClass) {
            fieldInstance._ui.$errorsWrapper
                .addClass('filled')
                .append($(fieldInstance.options.errorTemplate)
                    .addClass('parsley-' + name)
                    .html(message || this._getErrorMessage(fieldInstance, assert)));
            if (true !== doNotUpdateClass)
                this._errorClass(fieldInstance);
        },
        // Same as above
        updateError: function(fieldInstance, name, message, assert, doNotUpdateClass) {
            fieldInstance._ui.$errorsWrapper
                .addClass('filled')
                .find('.parsley-' + name)
                .html(message || this._getErrorMessage(fieldInstance, assert));
            if (true !== doNotUpdateClass)
                this._errorClass(fieldInstance);
        },
        // Same as above twice
        removeError: function(fieldInstance, name, doNotUpdateClass) {
            fieldInstance._ui.$errorsWrapper
                .removeClass('filled')
                .find('.parsley-' + name)
                .remove();
            // edge case possible here: remove a standard Parsley error that is still failing in fieldInstance.validationResult
            // but highly improbable cuz' manually removing a well Parsley handled error makes no sense.
            if (true !== doNotUpdateClass)
                this.manageStatusClass(fieldInstance);
        },
        focus: function(formInstance) {
            if (true === formInstance.validationResult || 'none' === formInstance.options.focus)
                return formInstance._focusedField = null;
            formInstance._focusedField = null;
            for (var i = 0; i < formInstance.fields.length; i++)
                if (true !== formInstance.fields[i].validationResult && formInstance.fields[i].validationResult.length > 0 && 'undefined' === typeof formInstance.fields[i].options.noFocus) {
                    if ('first' === formInstance.options.focus) {
                        formInstance._focusedField = formInstance.fields[i].$element;
                        return formInstance._focusedField.focus();
                    }
                    formInstance._focusedField = formInstance.fields[i].$element;
                }
            if (null === formInstance._focusedField)
                return null;
            return formInstance._focusedField.focus();
        },
        _getErrorMessage: function(fieldInstance, constraint) {
            var customConstraintErrorMessage = constraint.name + 'Message';
            if ('undefined' !== typeof fieldInstance.options[customConstraintErrorMessage])
                return window.ParsleyValidator.formatMessage(fieldInstance.options[customConstraintErrorMessage], constraint.requirements);
            return window.ParsleyValidator.getErrorMessage(constraint);
        },
        _diff: function(newResult, oldResult, deep) {
            var
                added = [],
                kept = [];
            for (var i = 0; i < newResult.length; i++) {
                var found = false;
                for (var j = 0; j < oldResult.length; j++)
                    if (newResult[i].assert.name === oldResult[j].assert.name) {
                        found = true;
                        break;
                    }
                if (found)
                    kept.push(newResult[i]);
                else
                    added.push(newResult[i]);
            }
            return {
                kept: kept,
                added: added,
                removed: !deep ? this._diff(oldResult, newResult, true).added : []
            };
        },
        setupForm: function(formInstance) {
            formInstance.$element.on('submit.Parsley', false, $.proxy(formInstance.onSubmitValidate, formInstance));
            // UI could be disabled
            if (false === formInstance.options.uiEnabled)
                return;
            formInstance.$element.attr('novalidate', '');
        },
        setupField: function(fieldInstance) {
            var _ui = { active: false };
            // UI could be disabled
            if (false === fieldInstance.options.uiEnabled)
                return;
            _ui.active = true;
            // Give field its Parsley id in DOM
            fieldInstance.$element.attr(fieldInstance.options.namespace + 'id', fieldInstance.__id__);
            /** Generate important UI elements and store them in fieldInstance **/
            // $errorClassHandler is the $element that woul have parsley-error and parsley-success classes
            _ui.$errorClassHandler = this._manageClassHandler(fieldInstance);
            // $errorsWrapper is a div that would contain the various field errors, it will be appended into $errorsContainer
            _ui.errorsWrapperId = 'parsley-id-' + ('undefined' !== typeof fieldInstance.options.multiple ? 'multiple-' + fieldInstance.options.multiple : fieldInstance.__id__);
            _ui.$errorsWrapper = $(fieldInstance.options.errorsWrapper).attr('id', _ui.errorsWrapperId);
            // ValidationResult UI storage to detect what have changed bwt two validations, and update DOM accordingly
            _ui.lastValidationResult = [];
            _ui.validatedOnce = false;
            _ui.validationInformationVisible = false;
            // Store it in fieldInstance for later
            fieldInstance._ui = _ui;
            // Stops excluded inputs from getting errorContainer added
            if (!fieldInstance.$element.is(fieldInstance.options.excluded)) {
                /** Mess with DOM now **/
                this._insertErrorWrapper(fieldInstance);
            }
            // Bind triggers first time
            this.actualizeTriggers(fieldInstance);
        },
        // Determine which element will have `parsley-error` and `parsley-success` classes
        _manageClassHandler: function(fieldInstance) {
            // An element selector could be passed through DOM with `data-parsley-class-handler=#foo`
            if ('string' === typeof fieldInstance.options.classHandler && $(fieldInstance.options.classHandler).length)
                return $(fieldInstance.options.classHandler);
            // Class handled could also be determined by function given in Parsley options
            var $handler = fieldInstance.options.classHandler(fieldInstance);
            // If this function returned a valid existing DOM element, go for it
            if ('undefined' !== typeof $handler && $handler.length)
                return $handler;
            // Otherwise, if simple element (input, texatrea, select..) it will perfectly host the classes
            if ('undefined' === typeof fieldInstance.options.multiple || fieldInstance.$element.is('select'))
                return fieldInstance.$element;
            // But if multiple element (radio, checkbox), that would be their parent
            return fieldInstance.$element.parent();
        },
        _insertErrorWrapper: function(fieldInstance) {
            var $errorsContainer;
            if ('string' === typeof fieldInstance.options.errorsContainer) {
                if ($(fieldInstance.options.errorsContainer).length)
                    return $(fieldInstance.options.errorsContainer).append(fieldInstance._ui.$errorsWrapper);
                else if (window.console && window.console.warn)
                    window.console.warn('The errors container `' + fieldInstance.options.errorsContainer + '` does not exist in DOM');
            } else if ('function' === typeof fieldInstance.options.errorsContainer)
                $errorsContainer = fieldInstance.options.errorsContainer(fieldInstance);
            if ('undefined' !== typeof $errorsContainer && $errorsContainer.length)
                return $errorsContainer.append(fieldInstance._ui.$errorsWrapper);
            return 'undefined' === typeof fieldInstance.options.multiple ? fieldInstance.$element.after(fieldInstance._ui.$errorsWrapper) : fieldInstance.$element.parent().after(fieldInstance._ui.$errorsWrapper);
        },
        actualizeTriggers: function(fieldInstance) {
            var that = this;
            // Remove Parsley events already binded on this field
            if (fieldInstance.options.multiple)
                $('[' + fieldInstance.options.namespace + 'multiple="' + fieldInstance.options.multiple + '"]').each(function() {
                    $(this).off('.Parsley');
                });
            else
                fieldInstance.$element.off('.Parsley');
            // If no trigger is set, all good
            if (false === fieldInstance.options.trigger)
                return;
            var triggers = fieldInstance.options.trigger.replace(/^\s+/g, '').replace(/\s+$/g, '');
            if ('' === triggers)
                return;
            // Bind fieldInstance.eventValidate if exists (for parsley.ajax for example), ParsleyUI.eventValidate otherwise
            if (fieldInstance.options.multiple)
                $('[' + fieldInstance.options.namespace + 'multiple="' + fieldInstance.options.multiple + '"]').each(function() {
                    $(this).on(
                        triggers.split(' ').join('.Parsley ') + '.Parsley',
                        false,
                        $.proxy('function' === typeof fieldInstance.eventValidate ? fieldInstance.eventValidate : that.eventValidate, fieldInstance));
                });
            else
                fieldInstance.$element
                .on(
                    triggers.split(' ').join('.Parsley ') + '.Parsley',
                    false,
                    $.proxy('function' === typeof fieldInstance.eventValidate ? fieldInstance.eventValidate : this.eventValidate, fieldInstance));
        },
        // Called through $.proxy with fieldInstance. `this` context is ParsleyField
        eventValidate: function(event) {
            // For keyup, keypress, keydown.. events that could be a little bit obstrusive
            // do not validate if val length < min threshold on first validation. Once field have been validated once and info
            // about success or failure have been displayed, always validate with this trigger to reflect every yalidation change.
            if (new RegExp('key').test(event.type))
                if (!this._ui.validationInformationVisible && this.getValue().length <= this.options.validationThreshold)
                    return;
            this._ui.validatedOnce = true;
            this.validate();
        },
        manageFailingFieldTrigger: function(fieldInstance) {
            fieldInstance._ui.failedOnce = true;
            // Radio and checkboxes fields must bind every field multiple
            if (fieldInstance.options.multiple)
                $('[' + fieldInstance.options.namespace + 'multiple="' + fieldInstance.options.multiple + '"]').each(function() {
                    if (!new RegExp('change', 'i').test($(this).parsley().options.trigger || ''))
                        return $(this).on('change.ParsleyFailedOnce', false, $.proxy(fieldInstance.validate, fieldInstance));
                });
            // Select case
            if (fieldInstance.$element.is('select'))
                if (!new RegExp('change', 'i').test(fieldInstance.options.trigger || ''))
                    return fieldInstance.$element.on('change.ParsleyFailedOnce', false, $.proxy(fieldInstance.validate, fieldInstance));
                // All other inputs fields
            if (!new RegExp('keyup', 'i').test(fieldInstance.options.trigger || ''))
                return fieldInstance.$element.on('keyup.ParsleyFailedOnce', false, $.proxy(fieldInstance.validate, fieldInstance));
        },
        reset: function(parsleyInstance) {
            // Reset all event listeners
            parsleyInstance.$element.off('.Parsley');
            parsleyInstance.$element.off('.ParsleyFailedOnce');
            // Nothing to do if UI never initialized for this field
            if ('undefined' === typeof parsleyInstance._ui)
                return;
            if ('ParsleyForm' === parsleyInstance.__class__)
                return;
            // Reset all errors' li
            parsleyInstance._ui.$errorsWrapper.children().each(function() {
                $(this).remove();
            });
            // Reset validation class
            this._resetClass(parsleyInstance);
            // Reset validation flags and last validation result
            parsleyInstance._ui.validatedOnce = false;
            parsleyInstance._ui.lastValidationResult = [];
            parsleyInstance._ui.validationInformationVisible = false;
        },
        destroy: function(parsleyInstance) {
            this.reset(parsleyInstance);
            if ('ParsleyForm' === parsleyInstance.__class__)
                return;
            if ('undefined' !== typeof parsleyInstance._ui)
                parsleyInstance._ui.$errorsWrapper.remove();
            delete parsleyInstance._ui;
        },
        _successClass: function(fieldInstance) {
            fieldInstance._ui.validationInformationVisible = true;
            fieldInstance._ui.$errorClassHandler.removeClass(fieldInstance.options.errorClass).addClass(fieldInstance.options.successClass);
        },
        _errorClass: function(fieldInstance) {
            fieldInstance._ui.validationInformationVisible = true;
            fieldInstance._ui.$errorClassHandler.removeClass(fieldInstance.options.successClass).addClass(fieldInstance.options.errorClass);
        },
        _resetClass: function(fieldInstance) {
            fieldInstance._ui.$errorClassHandler.removeClass(fieldInstance.options.successClass).removeClass(fieldInstance.options.errorClass);
        }
    };

    var ParsleyOptionsFactory = function(defaultOptions, globalOptions, userOptions, namespace) {
        this.__class__ = 'OptionsFactory';
        this.__id__ = ParsleyUtils.hash(4);
        this.formOptions = null;
        this.fieldOptions = null;
        this.staticOptions = $.extend(true, {}, defaultOptions, globalOptions, userOptions, { namespace: namespace });
    };
    ParsleyOptionsFactory.prototype = {
        get: function(parsleyInstance) {
            if ('undefined' === typeof parsleyInstance.__class__)
                throw new Error('Parsley Instance expected');
            switch (parsleyInstance.__class__) {
                case 'Parsley':
                    return this.staticOptions;
                case 'ParsleyForm':
                    return this.getFormOptions(parsleyInstance);
                case 'ParsleyField':
                case 'ParsleyFieldMultiple':
                    return this.getFieldOptions(parsleyInstance);
                default:
                    throw new Error('Instance ' + parsleyInstance.__class__ + ' is not supported');
            }
        },
        getFormOptions: function(formInstance) {
            this.formOptions = ParsleyUtils.attr(formInstance.$element, this.staticOptions.namespace);
            // not deep extend, since formOptions is a 1 level deep object
            return $.extend({}, this.staticOptions, this.formOptions);
        },
        getFieldOptions: function(fieldInstance) {
            this.fieldOptions = ParsleyUtils.attr(fieldInstance.$element, this.staticOptions.namespace);
            if (null === this.formOptions && 'undefined' !== typeof fieldInstance.parent)
                this.formOptions = this.getFormOptions(fieldInstance.parent);
            // not deep extend, since formOptions and fieldOptions is a 1 level deep object
            return $.extend({}, this.staticOptions, this.formOptions, this.fieldOptions);
        }
    };

    var ParsleyForm = function(element, OptionsFactory) {
        this.__class__ = 'ParsleyForm';
        this.__id__ = ParsleyUtils.hash(4);
        if ('OptionsFactory' !== ParsleyUtils.get(OptionsFactory, '__class__'))
            throw new Error('You must give an OptionsFactory instance');
        this.OptionsFactory = OptionsFactory;
        this.$element = $(element);
        this.validationResult = null;
        this.options = this.OptionsFactory.get(this);
    };
    ParsleyForm.prototype = {
        onSubmitValidate: function(event) {
            this.validate(undefined, undefined, event);
            // prevent form submission if validation fails
            if (false === this.validationResult && event instanceof $.Event) {
                event.stopImmediatePropagation();
                event.preventDefault();
            }
            return this;
        },
        // @returns boolean
        validate: function(group, force, event) {
            this.submitEvent = event;
            this.validationResult = true;
            var fieldValidationResult = [];
            // Refresh form DOM options and form's fields that could have changed
            this._refreshFields();
            $.emit('parsley:form:validate', this);
            // loop through fields to validate them one by one
            for (var i = 0; i < this.fields.length; i++) {
                // do not validate a field if not the same as given validation group
                if (group && !this._isFieldInGroup(this.fields[i], group))
                    continue;
                fieldValidationResult = this.fields[i].validate(force);
                if (true !== fieldValidationResult && fieldValidationResult.length > 0 && this.validationResult)
                    this.validationResult = false;
            }
            $.emit('parsley:form:validated', this);
            return this.validationResult;
        },
        // Iterate over refreshed fields, and stop on first failure
        isValid: function(group, force) {
            this._refreshFields();
            for (var i = 0; i < this.fields.length; i++) {
                // do not validate a field if not the same as given validation group
                if (group && !this._isFieldInGroup(this.fields[i], group))
                    continue;
                if (false === this.fields[i].isValid(force))
                    return false;
            }
            return true;
        },
        _isFieldInGroup: function(field, group) {
            if (ParsleyUtils.isArray(field.options.group))
                return -1 !== $.inArray(field.options.group, group);
            return field.options.group === group;
        },
        _refreshFields: function() {
            return this.actualizeOptions()._bindFields();
        },
        _bindFields: function() {
            var self = this;
            this.fields = [];
            this.fieldsMappedById = {};
            this.$element.find(this.options.inputs).each(function() {
                var fieldInstance = new window.Parsley(this, {}, self);
                // Only add valid and not excluded `ParsleyField` and `ParsleyFieldMultiple` children
                if (('ParsleyField' === fieldInstance.__class__ || 'ParsleyFieldMultiple' === fieldInstance.__class__) && !fieldInstance.$element.is(fieldInstance.options.excluded))
                    if ('undefined' === typeof self.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__]) {
                        self.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__] = fieldInstance;
                        self.fields.push(fieldInstance);
                    }
            });
            return this;
        }
    };

    var ConstraintFactory = function(parsleyField, name, requirements, priority, isDomConstraint) {
        if (!new RegExp('ParsleyField').test(ParsleyUtils.get(parsleyField, '__class__')))
            throw new Error('ParsleyField or ParsleyFieldMultiple instance expected');
        if ('function' !== typeof window.ParsleyValidator.validators[name] &&
            'Assert' !== window.ParsleyValidator.validators[name](requirements).__parentClass__)
            throw new Error('Valid validator expected');
        var getPriority = function(parsleyField, name) {
            if ('undefined' !== typeof parsleyField.options[name + 'Priority'])
                return parsleyField.options[name + 'Priority'];
            return ParsleyUtils.get(window.ParsleyValidator.validators[name](requirements), 'priority') || 2;
        };
        priority = priority || getPriority(parsleyField, name);
        // If validator have a requirementsTransformer, execute it
        if ('function' === typeof window.ParsleyValidator.validators[name](requirements).requirementsTransformer)
            requirements = window.ParsleyValidator.validators[name](requirements).requirementsTransformer();
        return $.extend(window.ParsleyValidator.validators[name](requirements), {
            name: name,
            requirements: requirements,
            priority: priority,
            groups: [priority],
            isDomConstraint: isDomConstraint || ParsleyUtils.attr(parsleyField.$element, parsleyField.options.namespace, name)
        });
    };

    var ParsleyField = function(field, OptionsFactory, parsleyFormInstance) {
        this.__class__ = 'ParsleyField';
        this.__id__ = ParsleyUtils.hash(4);
        this.$element = $(field);
        // If we have a parent `ParsleyForm` instance given, use its `OptionsFactory`, and save parent
        if ('undefined' !== typeof parsleyFormInstance) {
            this.parent = parsleyFormInstance;
            this.OptionsFactory = this.parent.OptionsFactory;
            this.options = this.OptionsFactory.get(this);
            // Else, take the `Parsley` one
        } else {
            this.OptionsFactory = OptionsFactory;
            this.options = this.OptionsFactory.get(this);
        }
        // Initialize some properties
        this.constraints = [];
        this.constraintsByName = {};
        this.validationResult = [];
        // Bind constraints
        this._bindConstraints();
    };
    ParsleyField.prototype = {
        // # Public API
        // Validate field and $.emit some events for mainly `ParsleyUI`
        // @returns validationResult:
        //  - `true` if all constraint passes
        //  - `[]` if not required field and empty (not validated)
        //  - `[Violation, [Violation..]]` if there were validation errors
        validate: function(force) {
            this.value = this.getValue();
            // Field Validate event. `this.value` could be altered for custom needs
            $.emit('parsley:field:validate', this);
            $.emit('parsley:field:' + (this.isValid(force, this.value) ? 'success' : 'error'), this);
            // Field validated event. `this.validationResult` could be altered for custom needs too
            $.emit('parsley:field:validated', this);
            return this.validationResult;
        },
        // Just validate field. Do not trigger any event
        // Same @return as `validate()`
        isValid: function(force, value) {
            // Recompute options and rebind constraints to have latest changes
            this.refreshConstraints();
            // Sort priorities to validate more important first
            var priorities = this._getConstraintsSortedPriorities();
            // Value could be passed as argument, needed to add more power to 'parsley:field:validate'
            value = value || this.getValue();
            // If a field is empty and not required, leave it alone, it's just fine
            // Except if `data-parsley-validate-if-empty` explicitely added, useful for some custom validators
            if (0 === value.length && !this._isRequired() && 'undefined' === typeof this.options.validateIfEmpty && true !== force)
                return this.validationResult = [];
            // If we want to validate field against all constraints, just call Validator and let it do the job
            if (false === this.options.priorityEnabled)
                return true === (this.validationResult = this.validateThroughValidator(value, this.constraints, 'Any'));
            // Else, iterate over priorities one by one, and validate related asserts one by one
            for (var i = 0; i < priorities.length; i++)
                if (true !== (this.validationResult = this.validateThroughValidator(value, this.constraints, priorities[i])))
                    return false;
            return true;
        },
        // @returns Parsley field computed value that could be overrided or configured in DOM
        getValue: function() {
            var value;
            // Value could be overriden in DOM
            if ('undefined' !== typeof this.options.value)
                value = this.options.value;
            else
                value = this.$element.val();
            // Handle wrong DOM or configurations
            if ('undefined' === typeof value || null === value)
                return '';
            // Use `data-parsley-trim-value="true"` to auto trim inputs entry
            if (true === this.options.trimValue)
                return value.replace(/^\s+|\s+$/g, '');
            return value;
        },
        // Actualize options that could have change since previous validation
        // Re-bind accordingly constraints (could be some new, removed or updated)
        refreshConstraints: function() {
            return this.actualizeOptions()._bindConstraints();
        },
        /**
         * Add a new constraint to a field
         *
         * @method addConstraint
         * @param {String}   name
         * @param {Mixed}    requirements      optional
         * @param {Number}   priority          optional
         * @param {Boolean}  isDomConstraint   optional
         */
        addConstraint: function(name, requirements, priority, isDomConstraint) {
            name = name.toLowerCase();
            if ('function' === typeof window.ParsleyValidator.validators[name]) {
                var constraint = new ConstraintFactory(this, name, requirements, priority, isDomConstraint);
                // if constraint already exist, delete it and push new version
                if ('undefined' !== this.constraintsByName[constraint.name])
                    this.removeConstraint(constraint.name);
                this.constraints.push(constraint);
                this.constraintsByName[constraint.name] = constraint;
            }
            return this;
        },
        // Remove a constraint
        removeConstraint: function(name) {
            for (var i = 0; i < this.constraints.length; i++)
                if (name === this.constraints[i].name) {
                    this.constraints.splice(i, 1);
                    break;
                }
            return this;
        },
        // Update a constraint (Remove + re-add)
        updateConstraint: function(name, parameters, priority) {
            return this.removeConstraint(name)
                .addConstraint(name, parameters, priority);
        },
        // # Internals
        // Internal only.
        // Bind constraints from config + options + DOM
        _bindConstraints: function() {
            var constraints = [];
            // clean all existing DOM constraints to only keep javascript user constraints
            for (var i = 0; i < this.constraints.length; i++)
                if (false === this.constraints[i].isDomConstraint)
                    constraints.push(this.constraints[i]);
            this.constraints = constraints;
            // then re-add Parsley DOM-API constraints
            for (var name in this.options)
                this.addConstraint(name, this.options[name]);
            // finally, bind special HTML5 constraints
            return this._bindHtml5Constraints();
        },
        // Internal only.
        // Bind specific HTML5 constraints to be HTML5 compliant
        _bindHtml5Constraints: function() {
            // html5 required
            if (this.$element.hasClass('required') || this.$element.attr('required'))
                this.addConstraint('required', true, undefined, true);
            // html5 pattern
            if ('string' === typeof this.$element.attr('pattern'))
                this.addConstraint('pattern', this.$element.attr('pattern'), undefined, true);
            // range
            if ('undefined' !== typeof this.$element.attr('min') && 'undefined' !== typeof this.$element.attr('max'))
                this.addConstraint('range', [this.$element.attr('min'), this.$element.attr('max')], undefined, true);
            // HTML5 min
            else if ('undefined' !== typeof this.$element.attr('min'))
                this.addConstraint('min', this.$element.attr('min'), undefined, true);
            // HTML5 max
            else if ('undefined' !== typeof this.$element.attr('max'))
                this.addConstraint('max', this.$element.attr('max'), undefined, true);
            // html5 types
            var type = this.$element.attr('type');
            if ('undefined' === typeof type)
                return this;
            // Small special case here for HTML5 number, that is in fact an integer validator
            if ('number' === type)
                return this.addConstraint('type', 'integer', undefined, true);
            // Regular other HTML5 supported types
            else if (new RegExp(type, 'i').test('email url range'))
                return this.addConstraint('type', type, undefined, true);
            return this;
        },
        // Internal only.
        // Field is required if have required constraint without `false` value
        _isRequired: function() {
            if ('undefined' === typeof this.constraintsByName.required)
                return false;
            return false !== this.constraintsByName.required.requirements;
        },
        // Internal only.
        // Sort constraints by priority DESC
        _getConstraintsSortedPriorities: function() {
            var priorities = [];
            // Create array unique of priorities
            for (var i = 0; i < this.constraints.length; i++)
                if (-1 === priorities.indexOf(this.constraints[i].priority))
                    priorities.push(this.constraints[i].priority);
                // Sort them by priority DESC
            priorities.sort(function(a, b) { return b - a; });
            return priorities;
        }
    };

    var ParsleyMultiple = function() {
        this.__class__ = 'ParsleyFieldMultiple';
    };
    ParsleyMultiple.prototype = {
        // Add new `$element` sibling for multiple field
        addElement: function($element) {
            this.$elements.push($element);
            return this;
        },
        // See `ParsleyField.refreshConstraints()`
        refreshConstraints: function() {
            var fieldConstraints;
            this.constraints = [];
            // Select multiple special treatment
            if (this.$element.is('select')) {
                this.actualizeOptions()._bindConstraints();
                return this;
            }
            // Gather all constraints for each input in the multiple group
            for (var i = 0; i < this.$elements.length; i++) {
                // Check if element have not been dynamically removed since last binding
                if (!$('html').has(this.$elements[i]).length) {
                    this.$elements.splice(i, 1);
                    continue;
                }
                fieldConstraints = this.$elements[i].data('ParsleyFieldMultiple').refreshConstraints().constraints;
                for (var j = 0; j < fieldConstraints.length; j++)
                    this.addConstraint(fieldConstraints[j].name, fieldConstraints[j].requirements, fieldConstraints[j].priority, fieldConstraints[j].isDomConstraint);
            }
            return this;
        },
        // See `ParsleyField.getValue()`
        getValue: function() {
            // Value could be overriden in DOM
            if ('undefined' !== typeof this.options.value)
                return this.options.value;
            // Radio input case
            if (this.$element.is('input[type=radio]'))
                return $('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').val() || '';
            // checkbox input case
            if (this.$element.is('input[type=checkbox]')) {
                var values = [];
                $('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').each(function() {
                    values.push($(this).val());
                });
                return values.length ? values : [];
            }
            // Select multiple case
            if (this.$element.is('select') && null === this.$element.val())
                return [];
            // Default case that should never happen
            return this.$element.val();
        },
        _init: function(multiple) {
            this.$elements = [this.$element];
            this.options.multiple = multiple;
            return this;
        }
    };

    var
        o = $({}),
        subscribed = {};
    // $.listen(name, callback);
    // $.listen(name, context, callback);
    $.listen = function(name) {
        if ('undefined' === typeof subscribed[name])
            subscribed[name] = [];
        if ('function' === typeof arguments[1])
            return subscribed[name].push({ fn: arguments[1] });
        if ('object' === typeof arguments[1] && 'function' === typeof arguments[2])
            return subscribed[name].push({ fn: arguments[2], ctxt: arguments[1] });
        throw new Error('Wrong parameters');
    };
    $.listenTo = function(instance, name, fn) {
        if ('undefined' === typeof subscribed[name])
            subscribed[name] = [];
        if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
            throw new Error('Must give Parsley instance');
        if ('string' !== typeof name || 'function' !== typeof fn)
            throw new Error('Wrong parameters');
        subscribed[name].push({ instance: instance, fn: fn });
    };
    $.unsubscribe = function(name, fn) {
        if ('undefined' === typeof subscribed[name])
            return;
        if ('string' !== typeof name || 'function' !== typeof fn)
            throw new Error('Wrong arguments');
        for (var i = 0; i < subscribed[name].length; i++)
            if (subscribed[name][i].fn === fn)
                return subscribed[name].splice(i, 1);
    };
    $.unsubscribeTo = function(instance, name) {
        if ('undefined' === typeof subscribed[name])
            return;
        if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
            throw new Error('Must give Parsley instance');
        for (var i = 0; i < subscribed[name].length; i++)
            if ('undefined' !== typeof subscribed[name][i].instance && subscribed[name][i].instance.__id__ === instance.__id__)
                return subscribed[name].splice(i, 1);
    };
    $.unsubscribeAll = function(name) {
        if ('undefined' === typeof subscribed[name])
            return;
        delete subscribed[name];
    };
    // $.emit(name [, arguments...]);
    // $.emit(name, instance [, arguments..]);
    $.emit = function(name, instance) {
        if ('undefined' === typeof subscribed[name])
            return;
        // loop through registered callbacks for this event
        for (var i = 0; i < subscribed[name].length; i++) {
            // if instance is not registered, simple emit
            if ('undefined' === typeof subscribed[name][i].instance) {
                subscribed[name][i].fn.apply('undefined' !== typeof subscribed[name][i].ctxt ? subscribed[name][i].ctxt : o, Array.prototype.slice.call(arguments, 1));
                continue;
            }
            // if instance registered but no instance given for the emit, continue
            if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
                continue;
            // if instance is registered and same id, emit
            if (subscribed[name][i].instance.__id__ === instance.__id__) {
                subscribed[name][i].fn.apply(o, Array.prototype.slice.call(arguments, 1));
                continue;
            }
            // if registered instance is a Form and fired one is a Field, loop over all its fields and emit if field found
            if (subscribed[name][i].instance instanceof ParsleyForm && instance instanceof ParsleyField)
                for (var j = 0; j < subscribed[name][i].instance.fields.length; j++)
                    if (subscribed[name][i].instance.fields[j].__id__ === instance.__id__) {
                        subscribed[name][i].fn.apply(o, Array.prototype.slice.call(arguments, 1));
                        continue;
                    }
        }
    };
    $.subscribed = function() { return subscribed; };

    // ParsleyConfig definition if not already set
    window.ParsleyConfig = window.ParsleyConfig || {};
    window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};
    // Define then the messages
    window.ParsleyConfig.i18n.en = $.extend(window.ParsleyConfig.i18n.en || {}, {
        defaultMessage: "This value seems to be invalid.",
        type: {
            email: "This value should be a valid email.",
            url: "This value should be a valid url.",
            number: "This value should be a valid number.",
            integer: "This value should be a valid integer.",
            digits: "This value should be digits.",
            alphanum: "This value should be alphanumeric."
        },
        notblank: "This value should not be blank.",
        required: "This value is required.",
        pattern: "This value seems to be invalid.",
        min: "This value should be greater than or equal to %s.",
        max: "This value should be lower than or equal to %s.",
        range: "This value should be between %s and %s.",
        minlength: "This value is too short. It should have %s characters or more.",
        maxlength: "This value is too long. It should have %s characters or fewer.",
        length: "This value length is invalid. It should be between %s and %s characters long.",
        mincheck: "You must select at least %s choices.",
        maxcheck: "You must select %s choices or fewer.",
        check: "You must select between %s and %s choices.",
        equalto: "This value should be the same."
    });
    // If file is loaded after Parsley main file, auto-load locale
    if ('undefined' !== typeof window.ParsleyValidator)
        window.ParsleyValidator.addCatalog('en', window.ParsleyConfig.i18n.en, true);

    //     Parsley.js 2.0.5
    //     http://parsleyjs.org
    //     (c) 20012-2014 Guillaume Potier, Wisembly
    //     Parsley may be freely distributed under the MIT license.

    // ### Parsley factory
    var Parsley = function(element, options, parsleyFormInstance) {
        this.__class__ = 'Parsley';
        this.__version__ = '2.0.5';
        this.__id__ = ParsleyUtils.hash(4);
        // Parsley must be instanciated with a DOM element or jQuery $element
        if ('undefined' === typeof element)
            throw new Error('You must give an element');
        if ('undefined' !== typeof parsleyFormInstance && 'ParsleyForm' !== parsleyFormInstance.__class__)
            throw new Error('Parent instance must be a ParsleyForm instance');
        return this.init($(element), options, parsleyFormInstance);
    };
    Parsley.prototype = {
        init: function($element, options, parsleyFormInstance) {
            if (!$element.length)
                throw new Error('You must bind Parsley on an existing element.');
            this.$element = $element;
            // If element have already been binded, returns its saved Parsley instance
            if (this.$element.data('Parsley')) {
                var savedparsleyFormInstance = this.$element.data('Parsley');
                // If saved instance have been binded without a ParsleyForm parent and there is one given in this call, add it
                if ('undefined' !== typeof parsleyFormInstance)
                    savedparsleyFormInstance.parent = parsleyFormInstance;
                return savedparsleyFormInstance;
            }
            // Handle 'static' options
            this.OptionsFactory = new ParsleyOptionsFactory(ParsleyDefaults, ParsleyUtils.get(window, 'ParsleyConfig') || {}, options, this.getNamespace(options));
            this.options = this.OptionsFactory.get(this);
            // A ParsleyForm instance is obviously a `<form>` elem but also every node that is not an input and have `data-parsley-validate` attribute
            if (this.$element.is('form') || (ParsleyUtils.attr(this.$element, this.options.namespace, 'validate') && !this.$element.is(this.options.inputs)))
                return this.bind('parsleyForm');
            // Every other supported element and not excluded element is binded as a `ParsleyField` or `ParsleyFieldMultiple`
            else if (this.$element.is(this.options.inputs) && !this.$element.is(this.options.excluded))
                return this.isMultiple() ? this.handleMultiple(parsleyFormInstance) : this.bind('parsleyField', parsleyFormInstance);
            return this;
        },
        isMultiple: function() {
            return (this.$element.is('input[type=radio], input[type=checkbox]') && 'undefined' === typeof this.options.multiple) || (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple'));
        },
        // Multiples fields are a real nightmare :(
        // Maybe some refacto would be appreciated here..
        handleMultiple: function(parsleyFormInstance) {
            var
                that = this,
                name,
                multiple,
                parsleyMultipleInstance;
            // Get parsleyFormInstance options if exist, mixed with element attributes
            this.options = $.extend(this.options, parsleyFormInstance ? parsleyFormInstance.OptionsFactory.get(parsleyFormInstance) : {}, ParsleyUtils.attr(this.$element, this.options.namespace));
            // Handle multiple name
            if (this.options.multiple)
                multiple = this.options.multiple;
            else if ('undefined' !== typeof this.$element.attr('name') && this.$element.attr('name').length)
                multiple = name = this.$element.attr('name');
            else if ('undefined' !== typeof this.$element.attr('id') && this.$element.attr('id').length)
                multiple = this.$element.attr('id');
            // Special select multiple input
            if (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple')) {
                return this.bind('parsleyFieldMultiple', parsleyFormInstance, multiple || this.__id__);
                // Else for radio / checkboxes, we need a `name` or `data-parsley-multiple` to properly bind it
            } else if ('undefined' === typeof multiple) {
                if (window.console && window.console.warn)
                    window.console.warn('To be binded by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.', this.$element);
                return this;
            }
            // Remove special chars
            multiple = multiple.replace(/(:|\.|\[|\]|\$)/g, '');
            // Add proper `data-parsley-multiple` to siblings if we have a valid multiple name
            if ('undefined' !== typeof name) {
                $('input[name="' + name + '"]').each(function() {
                    if ($(this).is('input[type=radio], input[type=checkbox]'))
                        $(this).attr(that.options.namespace + 'multiple', multiple);
                });
            }
            // Check here if we don't already have a related multiple instance saved
            if ($('[' + this.options.namespace + 'multiple=' + multiple + ']').length) {
                for (var i = 0; i < $('[' + this.options.namespace + 'multiple=' + multiple + ']').length; i++) {
                    if ('undefined' !== typeof $($('[' + this.options.namespace + 'multiple=' + multiple + ']').get(i)).data('Parsley')) {
                        parsleyMultipleInstance = $($('[' + this.options.namespace + 'multiple=' + multiple + ']').get(i)).data('Parsley');
                        if (!this.$element.data('ParsleyFieldMultiple')) {
                            parsleyMultipleInstance.addElement(this.$element);
                            this.$element.attr(this.options.namespace + 'id', parsleyMultipleInstance.__id__);
                        }
                        break;
                    }
                }
            }
            // Create a secret ParsleyField instance for every multiple field. It would be stored in `data('ParsleyFieldMultiple')`
            // And would be useful later to access classic `ParsleyField` stuff while being in a `ParsleyFieldMultiple` instance
            this.bind('parsleyField', parsleyFormInstance, multiple, true);
            return parsleyMultipleInstance || this.bind('parsleyFieldMultiple', parsleyFormInstance, multiple);
        },
        // Retrieve namespace used for DOM-API
        getNamespace: function(options) {
            // `data-parsley-namespace=<namespace>`
            if ('undefined' !== typeof this.$element.data('parsleyNamespace'))
                return this.$element.data('parsleyNamespace');
            if ('undefined' !== typeof ParsleyUtils.get(options, 'namespace'))
                return options.namespace;
            if ('undefined' !== typeof ParsleyUtils.get(window, 'ParsleyConfig.namespace'))
                return window.ParsleyConfig.namespace;
            return ParsleyDefaults.namespace;
        },
        // Return proper `ParsleyForm`, `ParsleyField` or `ParsleyFieldMultiple`
        bind: function(type, parentParsleyFormInstance, multiple, doNotStore) {
            var parsleyInstance;
            switch (type) {
                case 'parsleyForm':
                    parsleyInstance = $.extend(
                        new ParsleyForm(this.$element, this.OptionsFactory),
                        new ParsleyAbstract(),
                        window.ParsleyExtend
                    )._bindFields();
                    break;
                case 'parsleyField':
                    parsleyInstance = $.extend(
                        new ParsleyField(this.$element, this.OptionsFactory, parentParsleyFormInstance),
                        new ParsleyAbstract(),
                        window.ParsleyExtend
                    );
                    break;
                case 'parsleyFieldMultiple':
                    parsleyInstance = $.extend(
                        new ParsleyField(this.$element, this.OptionsFactory, parentParsleyFormInstance),
                        new ParsleyAbstract(),
                        new ParsleyMultiple(),
                        window.ParsleyExtend
                    )._init(multiple);
                    break;
                default:
                    throw new Error(type + 'is not a supported Parsley type');
            }
            if ('undefined' !== typeof multiple)
                ParsleyUtils.setAttr(this.$element, this.options.namespace, 'multiple', multiple);
            if ('undefined' !== typeof doNotStore) {
                this.$element.data('ParsleyFieldMultiple', parsleyInstance);
                return parsleyInstance;
            }
            // Store instance if `ParsleyForm`, `ParsleyField` or `ParsleyFieldMultiple`
            if (new RegExp('ParsleyF', 'i').test(parsleyInstance.__class__)) {
                // Store for later access the freshly binded instance in DOM element itself using jQuery `data()`
                this.$element.data('Parsley', parsleyInstance);
                // Tell the world we got a new ParsleyForm or ParsleyField instance!
                $.emit('parsley:' + ('parsleyForm' === type ? 'form' : 'field') + ':init', parsleyInstance);
            }
            return parsleyInstance;
        }
    };
    // ### jQuery API
    // `$('.elem').parsley(options)` or `$('.elem').psly(options)`
    $.fn.parsley = $.fn.psly = function(options) {
        if (this.length > 1) {
            var instances = [];
            this.each(function() {
                instances.push($(this).parsley(options));
            });
            return instances;
        }
        // Return undefined if applied to non existing DOM element
        if (!$(this).length) {
            if (window.console && window.console.warn)
                window.console.warn('You must bind Parsley on an existing element.');
            return;
        }
        return new Parsley(this, options);
    };
    // ### ParsleyUI
    // UI is a class apart that only listen to some events and them modify DOM accordingly
    // Could be overriden by defining a `window.ParsleyConfig.ParsleyUI` appropriate class (with `listen()` method basically)
    window.ParsleyUI = 'function' === typeof ParsleyUtils.get(window, 'ParsleyConfig.ParsleyUI') ?
        new window.ParsleyConfig.ParsleyUI().listen() : new ParsleyUI().listen();
    // ### ParsleyField and ParsleyForm extension
    // Ensure that defined if not already the case
    if ('undefined' === typeof window.ParsleyExtend)
        window.ParsleyExtend = {};
    // ### ParsleyConfig
    // Ensure that defined if not already the case
    if ('undefined' === typeof window.ParsleyConfig)
        window.ParsleyConfig = {};
    // ### Globals
    window.Parsley = window.psly = Parsley;
    window.ParsleyUtils = ParsleyUtils;
    window.ParsleyValidator = new ParsleyValidator(window.ParsleyConfig.validators, window.ParsleyConfig.i18n);
    // ### PARSLEY auto-binding
    // Prevent it by setting `ParsleyConfig.autoBind` to `false`
    if (false !== ParsleyUtils.get(window, 'ParsleyConfig.autoBind'))
        $(document).ready(function() {
            // Works only on `data-parsley-validate`.
            if ($('[data-parsley-validate]').length)
                $('[data-parsley-validate]').parsley();
        });
}));

/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
        } catch (e) {
            return;
        }

        try {
            // If we can't parse the cookie, ignore it, it's unusable.
            return config.json ? JSON.parse(s) : s;
        } catch (e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function(key, value, options) {

        // Write
        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function(key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

}));

/*!
Waypoints - 3.1.1
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
(function() {
    'use strict'

    var keyCounter = 0
    var allWaypoints = {}

    /* http://imakewebthings.com/waypoints/api/waypoint */
    function Waypoint(options) {
        if (!options) {
            throw new Error('No options passed to Waypoint constructor')
        }
        if (!options.element) {
            throw new Error('No element option passed to Waypoint constructor')
        }
        if (!options.handler) {
            throw new Error('No handler option passed to Waypoint constructor')
        }

        this.key = 'waypoint-' + keyCounter
        this.options = Waypoint.Adapter.extend({}, Waypoint.defaults, options)
        this.element = this.options.element
        this.adapter = new Waypoint.Adapter(this.element)
        this.callback = options.handler
        this.axis = this.options.horizontal ? 'horizontal' : 'vertical'
        this.enabled = this.options.enabled
        this.triggerPoint = null
        this.group = Waypoint.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        })
        this.context = Waypoint.Context.findOrCreateByElement(this.options.context)

        if (Waypoint.offsetAliases[this.options.offset]) {
            this.options.offset = Waypoint.offsetAliases[this.options.offset]
        }
        this.group.add(this)
        this.context.add(this)
        allWaypoints[this.key] = this
        keyCounter += 1
    }

    /* Private */
    Waypoint.prototype.queueTrigger = function(direction) {
        this.group.queueTrigger(this, direction)
    }

    /* Private */
    Waypoint.prototype.trigger = function(args) {
        if (!this.enabled) {
            return
        }
        if (this.callback) {
            this.callback.apply(this, args)
        }
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/destroy */
    Waypoint.prototype.destroy = function() {
        this.context.remove(this)
        this.group.remove(this)
        delete allWaypoints[this.key]
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/disable */
    Waypoint.prototype.disable = function() {
        this.enabled = false
        return this
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/enable */
    Waypoint.prototype.enable = function() {
        this.context.refresh()
        this.enabled = true
        return this
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/next */
    Waypoint.prototype.next = function() {
        return this.group.next(this)
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/previous */
    Waypoint.prototype.previous = function() {
        return this.group.previous(this)
    }

    /* Private */
    Waypoint.invokeAll = function(method) {
        var allWaypointsArray = []
        for (var waypointKey in allWaypoints) {
            allWaypointsArray.push(allWaypoints[waypointKey])
        }
        for (var i = 0, end = allWaypointsArray.length; i < end; i++) {
            allWaypointsArray[i][method]()
        }
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/destroy-all */
    Waypoint.destroyAll = function() {
        Waypoint.invokeAll('destroy')
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/disable-all */
    Waypoint.disableAll = function() {
        Waypoint.invokeAll('disable')
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/enable-all */
    Waypoint.enableAll = function() {
        Waypoint.invokeAll('enable')
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/refresh-all */
    Waypoint.refreshAll = function() {
        Waypoint.Context.refreshAll()
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/viewport-height */
    Waypoint.viewportHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/viewport-width */
    Waypoint.viewportWidth = function() {
        return document.documentElement.clientWidth
    }

    Waypoint.adapters = []

    Waypoint.defaults = {
        context: window,
        continuous: true,
        enabled: true,
        group: 'default',
        horizontal: false,
        offset: 0
    }

    Waypoint.offsetAliases = {
        'bottom-in-view': function() {
            return this.context.innerHeight() - this.adapter.outerHeight()
        },
        'right-in-view': function() {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    }

    window.Waypoint = Waypoint
}());
(function() {
    'use strict'

    function requestAnimationFrameShim(callback) {
        window.setTimeout(callback, 1000 / 60)
    }

    var keyCounter = 0
    var contexts = {}
    var Waypoint = window.Waypoint
    var oldWindowLoad = window.onload

    /* http://imakewebthings.com/waypoints/api/context */
    function Context(element) {
        this.element = element
        this.Adapter = Waypoint.Adapter
        this.adapter = new this.Adapter(element)
        this.key = 'waypoint-context-' + keyCounter
        this.didScroll = false
        this.didResize = false
        this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        }
        this.waypoints = {
            vertical: {},
            horizontal: {}
        }

        element.waypointContextKey = this.key
        contexts[element.waypointContextKey] = this
        keyCounter += 1

        this.createThrottledScrollHandler()
        this.createThrottledResizeHandler()
    }

    /* Private */
    Context.prototype.add = function(waypoint) {
        var axis = waypoint.options.horizontal ? 'horizontal' : 'vertical'
        this.waypoints[axis][waypoint.key] = waypoint
        this.refresh()
    }

    /* Private */
    Context.prototype.checkEmpty = function() {
        var horizontalEmpty = this.Adapter.isEmptyObject(this.waypoints.horizontal)
        var verticalEmpty = this.Adapter.isEmptyObject(this.waypoints.vertical)
        if (horizontalEmpty && verticalEmpty) {
            this.adapter.off('.waypoints')
            delete contexts[this.key]
        }
    }

    /* Private */
    Context.prototype.createThrottledResizeHandler = function() {
        var self = this

        function resizeHandler() {
            self.handleResize()
            self.didResize = false
        }

        this.adapter.on('resize.waypoints', function() {
            if (!self.didResize) {
                self.didResize = true
                Waypoint.requestAnimationFrame(resizeHandler)
            }
        })
    }

    /* Private */
    Context.prototype.createThrottledScrollHandler = function() {
        var self = this

        function scrollHandler() {
            self.handleScroll()
            self.didScroll = false
        }

        this.adapter.on('scroll.waypoints', function() {
            if (!self.didScroll || Waypoint.isTouch) {
                self.didScroll = true
                Waypoint.requestAnimationFrame(scrollHandler)
            }
        })
    }

    /* Private */
    Context.prototype.handleResize = function() {
        Waypoint.Context.refreshAll()
    }

    /* Private */
    Context.prototype.handleScroll = function() {
        var triggeredGroups = {}
        var axes = {
            horizontal: {
                newScroll: this.adapter.scrollLeft(),
                oldScroll: this.oldScroll.x,
                forward: 'right',
                backward: 'left'
            },
            vertical: {
                newScroll: this.adapter.scrollTop(),
                oldScroll: this.oldScroll.y,
                forward: 'down',
                backward: 'up'
            }
        }

        for (var axisKey in axes) {
            var axis = axes[axisKey]
            var isForward = axis.newScroll > axis.oldScroll
            var direction = isForward ? axis.forward : axis.backward

            for (var waypointKey in this.waypoints[axisKey]) {
                var waypoint = this.waypoints[axisKey][waypointKey]
                var wasBeforeTriggerPoint = axis.oldScroll < waypoint.triggerPoint
                var nowAfterTriggerPoint = axis.newScroll >= waypoint.triggerPoint
                var crossedForward = wasBeforeTriggerPoint && nowAfterTriggerPoint
                var crossedBackward = !wasBeforeTriggerPoint && !nowAfterTriggerPoint
                if (crossedForward || crossedBackward) {
                    waypoint.queueTrigger(direction)
                    triggeredGroups[waypoint.group.id] = waypoint.group
                }
            }
        }

        for (var groupKey in triggeredGroups) {
            triggeredGroups[groupKey].flushTriggers()
        }

        this.oldScroll = {
            x: axes.horizontal.newScroll,
            y: axes.vertical.newScroll
        }
    }

    /* Private */
    Context.prototype.innerHeight = function() {
        /*eslint-disable eqeqeq */
        if (this.element == this.element.window) {
            return Waypoint.viewportHeight()
        }
        /*eslint-enable eqeqeq */
        return this.adapter.innerHeight()
    }

    /* Private */
    Context.prototype.remove = function(waypoint) {
        delete this.waypoints[waypoint.axis][waypoint.key]
        this.checkEmpty()
    }

    /* Private */
    Context.prototype.innerWidth = function() {
        /*eslint-disable eqeqeq */
        if (this.element == this.element.window) {
            return Waypoint.viewportWidth()
        }
        /*eslint-enable eqeqeq */
        return this.adapter.innerWidth()
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/context-destroy */
    Context.prototype.destroy = function() {
        var allWaypoints = []
        for (var axis in this.waypoints) {
            for (var waypointKey in this.waypoints[axis]) {
                allWaypoints.push(this.waypoints[axis][waypointKey])
            }
        }
        for (var i = 0, end = allWaypoints.length; i < end; i++) {
            allWaypoints[i].destroy()
        }
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/context-refresh */
    Context.prototype.refresh = function() {
        /*eslint-disable eqeqeq */
        var isWindow = this.element == this.element.window
            /*eslint-enable eqeqeq */
        var contextOffset = this.adapter.offset()
        var triggeredGroups = {}
        var axes

        this.handleScroll()
        axes = {
            horizontal: {
                contextOffset: isWindow ? 0 : contextOffset.left,
                contextScroll: isWindow ? 0 : this.oldScroll.x,
                contextDimension: this.innerWidth(),
                oldScroll: this.oldScroll.x,
                forward: 'right',
                backward: 'left',
                offsetProp: 'left'
            },
            vertical: {
                contextOffset: isWindow ? 0 : contextOffset.top,
                contextScroll: isWindow ? 0 : this.oldScroll.y,
                contextDimension: this.innerHeight(),
                oldScroll: this.oldScroll.y,
                forward: 'down',
                backward: 'up',
                offsetProp: 'top'
            }
        }

        for (var axisKey in axes) {
            var axis = axes[axisKey]
            for (var waypointKey in this.waypoints[axisKey]) {
                var waypoint = this.waypoints[axisKey][waypointKey]
                var adjustment = waypoint.options.offset
                var oldTriggerPoint = waypoint.triggerPoint
                var elementOffset = 0
                var freshWaypoint = oldTriggerPoint == null
                var contextModifier, wasBeforeScroll, nowAfterScroll
                var triggeredBackward, triggeredForward

                if (waypoint.element !== waypoint.element.window) {
                    elementOffset = waypoint.adapter.offset()[axis.offsetProp]
                }

                if (typeof adjustment === 'function') {
                    adjustment = adjustment.apply(waypoint)
                } else if (typeof adjustment === 'string') {
                    adjustment = parseFloat(adjustment)
                    if (waypoint.options.offset.indexOf('%') > -1) {
                        adjustment = Math.ceil(axis.contextDimension * adjustment / 100)
                    }
                }

                contextModifier = axis.contextScroll - axis.contextOffset
                waypoint.triggerPoint = elementOffset + contextModifier - adjustment
                wasBeforeScroll = oldTriggerPoint < axis.oldScroll
                nowAfterScroll = waypoint.triggerPoint >= axis.oldScroll
                triggeredBackward = wasBeforeScroll && nowAfterScroll
                triggeredForward = !wasBeforeScroll && !nowAfterScroll

                if (!freshWaypoint && triggeredBackward) {
                    waypoint.queueTrigger(axis.backward)
                    triggeredGroups[waypoint.group.id] = waypoint.group
                } else if (!freshWaypoint && triggeredForward) {
                    waypoint.queueTrigger(axis.forward)
                    triggeredGroups[waypoint.group.id] = waypoint.group
                } else if (freshWaypoint && axis.oldScroll >= waypoint.triggerPoint) {
                    waypoint.queueTrigger(axis.forward)
                    triggeredGroups[waypoint.group.id] = waypoint.group
                }
            }
        }

        for (var groupKey in triggeredGroups) {
            triggeredGroups[groupKey].flushTriggers()
        }

        return this
    }

    /* Private */
    Context.findOrCreateByElement = function(element) {
        return Context.findByElement(element) || new Context(element)
    }

    /* Private */
    Context.refreshAll = function() {
        for (var contextId in contexts) {
            contexts[contextId].refresh()
        }
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/context-find-by-element */
    Context.findByElement = function(element) {
        return contexts[element.waypointContextKey]
    }

    window.onload = function() {
        if (oldWindowLoad) {
            oldWindowLoad()
        }
        Context.refreshAll()
    }

    Waypoint.requestAnimationFrame = function(callback) {
        var requestFn = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            requestAnimationFrameShim
        requestFn.call(window, callback)
    }
    Waypoint.Context = Context
}());
(function() {
    'use strict'

    function byTriggerPoint(a, b) {
        return a.triggerPoint - b.triggerPoint
    }

    function byReverseTriggerPoint(a, b) {
        return b.triggerPoint - a.triggerPoint
    }

    var groups = {
        vertical: {},
        horizontal: {}
    }
    var Waypoint = window.Waypoint

    /* http://imakewebthings.com/waypoints/api/group */
    function Group(options) {
        this.name = options.name
        this.axis = options.axis
        this.id = this.name + '-' + this.axis
        this.waypoints = []
        this.clearTriggerQueues()
        groups[this.axis][this.name] = this
    }

    /* Private */
    Group.prototype.add = function(waypoint) {
        this.waypoints.push(waypoint)
    }

    /* Private */
    Group.prototype.clearTriggerQueues = function() {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        }
    }

    /* Private */
    Group.prototype.flushTriggers = function() {
        for (var direction in this.triggerQueues) {
            var waypoints = this.triggerQueues[direction]
            var reverse = direction === 'up' || direction === 'left'
            waypoints.sort(reverse ? byReverseTriggerPoint : byTriggerPoint)
            for (var i = 0, end = waypoints.length; i < end; i += 1) {
                var waypoint = waypoints[i]
                if (waypoint.options.continuous || i === waypoints.length - 1) {
                    waypoint.trigger([direction])
                }
            }
        }
        this.clearTriggerQueues()
    }

    /* Private */
    Group.prototype.next = function(waypoint) {
        this.waypoints.sort(byTriggerPoint)
        var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
        var isLast = index === this.waypoints.length - 1
        return isLast ? null : this.waypoints[index + 1]
    }

    /* Private */
    Group.prototype.previous = function(waypoint) {
        this.waypoints.sort(byTriggerPoint)
        var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
        return index ? this.waypoints[index - 1] : null
    }

    /* Private */
    Group.prototype.queueTrigger = function(waypoint, direction) {
        this.triggerQueues[direction].push(waypoint)
    }

    /* Private */
    Group.prototype.remove = function(waypoint) {
        var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
        if (index > -1) {
            this.waypoints.splice(index, 1)
        }
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/first */
    Group.prototype.first = function() {
        return this.waypoints[0]
    }

    /* Public */
    /* http://imakewebthings.com/waypoints/api/last */
    Group.prototype.last = function() {
        return this.waypoints[this.waypoints.length - 1]
    }

    /* Private */
    Group.findOrCreate = function(options) {
        return groups[options.axis][options.name] || new Group(options)
    }

    Waypoint.Group = Group
}());
(function() {
    'use strict'

    var $ = window.jQuery
    var Waypoint = window.Waypoint

    function JQueryAdapter(element) {
        this.$element = $(element)
    }

    $.each([
        'innerHeight',
        'innerWidth',
        'off',
        'offset',
        'on',
        'outerHeight',
        'outerWidth',
        'scrollLeft',
        'scrollTop'
    ], function(i, method) {
        JQueryAdapter.prototype[method] = function() {
            var args = Array.prototype.slice.call(arguments)
            return this.$element[method].apply(this.$element, args)
        }
    })

    $.each([
        'extend',
        'inArray',
        'isEmptyObject'
    ], function(i, method) {
        JQueryAdapter[method] = $[method]
    })

    Waypoint.adapters.push({
        name: 'jquery',
        Adapter: JQueryAdapter
    })
    Waypoint.Adapter = JQueryAdapter
}());
(function() {
    'use strict'

    var Waypoint = window.Waypoint

    function createExtension(framework) {
        return function() {
            var waypoints = []
            var overrides = arguments[0]

            if (framework.isFunction(arguments[0])) {
                overrides = framework.extend({}, arguments[1])
                overrides.handler = arguments[0]
            }

            this.each(function() {
                var options = framework.extend({}, overrides, {
                    element: this
                })
                if (typeof options.context === 'string') {
                    options.context = framework(this).closest(options.context)[0]
                }
                waypoints.push(new Waypoint(options))
            })

            return waypoints
        }
    }

    if (window.jQuery) {
        window.jQuery.fn.waypoint = createExtension(window.jQuery)
    }
    if (window.Zepto) {
        window.Zepto.fn.waypoint = createExtension(window.Zepto)
    }
}());
/**
 * jquery.mask.js
 * @version: v1.11.4
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at http://blog.igorescobar.com
 *
 * Copyright (c) 2012 Igor Escobar http://blog.igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* jshint laxbreak: true */
/* global define, jQuery, Zepto */

'use strict';

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
(function(factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }

}(function($) {

    var Mask = function(el, mask, options) {
        el = $(el);

        var jMask = this,
            oldValue = el.val(),
            regexMask;

        mask = typeof mask === 'function' ? mask(el.val(), undefined, el, options) : mask;

        var p = {
            invalid: [],
            getCaret: function() {
                try {
                    var sel,
                        pos = 0,
                        ctrl = el.get(0),
                        dSel = document.selection,
                        cSelStart = ctrl.selectionStart;

                    // IE Support
                    if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                        sel = dSel.createRange();
                        sel.moveStart('character', el.is('input') ? -el.val().length : -el.text().length);
                        pos = sel.text.length;
                    }
                    // Firefox support
                    else if (cSelStart || cSelStart === '0') {
                        pos = cSelStart;
                    }

                    return pos;
                } catch (e) {}
            },
            setCaret: function(pos) {
                try {
                    if (el.is(':focus')) {
                        var range, ctrl = el.get(0);

                        if (ctrl.setSelectionRange) {
                            ctrl.setSelectionRange(pos, pos);
                        } else if (ctrl.createTextRange) {
                            range = ctrl.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }
                } catch (e) {}
            },
            events: function() {
                el
                    .on('keyup.mask', p.behaviour)
                    .on('paste.mask drop.mask', function() {
                        setTimeout(function() {
                            el.keydown().keyup();
                        }, 100);
                    })
                    .on('change.mask', function() {
                        el.data('changed', true);
                    })
                    .on('blur.mask', function() {
                        if (oldValue !== el.val() && !el.data('changed')) {
                            el.triggerHandler('change');
                        }
                        el.data('changed', false);
                    })
                    // it's very important that this callback remains in this position
                    // otherwhise oldValue it's going to work buggy
                    .on('keydown.mask, blur.mask', function() {
                        oldValue = el.val();
                    })
                    // select all text on focus
                    .on('focus.mask', function(e) {
                        if (options.selectOnFocus === true) {
                            $(e.target).select();
                        }
                    })
                    // clear the value if it not complete the mask
                    .on('focusout.mask', function() {
                        if (options.clearIfNotMatch && !regexMask.test(p.val())) {
                            p.val('');
                        }
                    });
            },
            getRegexMask: function() {
                var maskChunks = [],
                    translation, pattern, optional, recursive, oRecursive, r;

                for (var i = 0; i < mask.length; i++) {
                    translation = jMask.translation[mask.charAt(i)];

                    if (translation) {

                        pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                        optional = translation.optional;
                        recursive = translation.recursive;

                        if (recursive) {
                            maskChunks.push(mask.charAt(i));
                            oRecursive = { digit: mask.charAt(i), pattern: pattern };
                        } else {
                            maskChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
                        }

                    } else {
                        maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                    }
                }

                r = maskChunks.join('');

                if (oRecursive) {
                    r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                        .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
                }

                return new RegExp(r);
            },
            destroyEvents: function() {
                el.off(['keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
            },
            val: function(v) {
                var isInput = el.is('input'),
                    method = isInput ? 'val' : 'text',
                    r;

                if (arguments.length > 0) {
                    if (el[method]() !== v) {
                        el[method](v);
                    }
                    r = el;
                } else {
                    r = el[method]();
                }

                return r;
            },
            getMCharsBeforeCount: function(index, onCleanVal) {
                for (var count = 0, i = 0, maskL = mask.length; i < maskL && i < index; i++) {
                    if (!jMask.translation[mask.charAt(i)]) {
                        index = onCleanVal ? index + 1 : index;
                        count++;
                    }
                }
                return count;
            },
            caretPos: function(originalCaretPos, oldLength, newLength, maskDif) {
                var translation = jMask.translation[mask.charAt(Math.min(originalCaretPos - 1, mask.length - 1))];

                return !translation ? p.caretPos(originalCaretPos + 1, oldLength, newLength, maskDif) :
                    Math.min(originalCaretPos + newLength - oldLength - maskDif, newLength);
            },
            behaviour: function(e) {
                e = e || window.event;
                p.invalid = [];
                var keyCode = e.keyCode || e.which;
                if ($.inArray(keyCode, jMask.byPassKeys) === -1) {

                    var caretPos = p.getCaret(),
                        currVal = p.val(),
                        currValL = currVal.length,
                        changeCaret = caretPos < currValL,
                        newVal = p.getMasked(),
                        newValL = newVal.length,
                        maskDif = p.getMCharsBeforeCount(newValL - 1) - p.getMCharsBeforeCount(currValL - 1);

                    p.val(newVal);

                    // change caret but avoid CTRL+A
                    if (changeCaret && !(keyCode === 65 && e.ctrlKey)) {
                        // Avoid adjusting caret on backspace or delete
                        if (!(keyCode === 8 || keyCode === 46)) {
                            caretPos = p.caretPos(caretPos, currValL, newValL, maskDif);
                        }
                        p.setCaret(caretPos);
                    }

                    return p.callbacks(e);
                }
            },
            getMasked: function(skipMaskChars) {
                var buf = [],
                    value = p.val(),
                    m = 0,
                    maskLen = mask.length,
                    v = 0,
                    valLen = value.length,
                    offset = 1,
                    addMethod = 'push',
                    resetPos = -1,
                    lastMaskChar,
                    check;

                if (options.reverse) {
                    addMethod = 'unshift';
                    offset = -1;
                    lastMaskChar = 0;
                    m = maskLen - 1;
                    v = valLen - 1;
                    check = function() {
                        return m > -1 && v > -1;
                    };
                } else {
                    lastMaskChar = maskLen - 1;
                    check = function() {
                        return m < maskLen && v < valLen;
                    };
                }

                while (check()) {
                    var maskDigit = mask.charAt(m),
                        valDigit = value.charAt(v),
                        translation = jMask.translation[maskDigit];

                    if (translation) {
                        if (valDigit.match(translation.pattern)) {
                            buf[addMethod](valDigit);
                            if (translation.recursive) {
                                if (resetPos === -1) {
                                    resetPos = m;
                                } else if (m === lastMaskChar) {
                                    m = resetPos - offset;
                                }

                                if (lastMaskChar === resetPos) {
                                    m -= offset;
                                }
                            }
                            m += offset;
                        } else if (translation.optional) {
                            m += offset;
                            v -= offset;
                        } else if (translation.fallback) {
                            buf[addMethod](translation.fallback);
                            m += offset;
                            v -= offset;
                        } else {
                            p.invalid.push({ p: v, v: valDigit, e: translation.pattern });
                        }
                        v += offset;
                    } else {
                        if (!skipMaskChars) {
                            buf[addMethod](maskDigit);
                        }

                        if (valDigit === maskDigit) {
                            v += offset;
                        }

                        m += offset;
                    }
                }

                var lastMaskCharDigit = mask.charAt(lastMaskChar);
                if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
                    buf.push(lastMaskCharDigit);
                }

                return buf.join('');
            },
            callbacks: function(e) {
                var val = p.val(),
                    changed = val !== oldValue,
                    defaultArgs = [val, e, el, options],
                    callback = function(name, criteria, args) {
                        if (typeof options[name] === 'function' && criteria) {
                            options[name].apply(this, args);
                        }
                    };

                callback('onChange', changed === true, defaultArgs);
                callback('onKeyPress', changed === true, defaultArgs);
                callback('onComplete', val.length === mask.length, defaultArgs);
                callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
            }
        };


        // public methods
        jMask.mask = mask;
        jMask.options = options;
        jMask.remove = function() {
            var caret = p.getCaret();
            p.destroyEvents();
            p.val(jMask.getCleanVal());
            p.setCaret(caret - p.getMCharsBeforeCount(caret));
            return el;
        };

        // get value without mask
        jMask.getCleanVal = function() {
            return p.getMasked(true);
        };

        jMask.init = function(onlyMask) {
            onlyMask = onlyMask || false;
            options = options || {};

            jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
            jMask.translation = $.jMaskGlobals.translation;

            jMask.translation = $.extend({}, jMask.translation, options.translation);
            jMask = $.extend(true, {}, jMask, options);

            regexMask = p.getRegexMask();

            if (onlyMask === false) {

                if (options.placeholder) {
                    el.attr('placeholder', options.placeholder);
                }

                // autocomplete needs to be off. we can't intercept events
                // the browser doesn't  fire any kind of event when something is
                // selected in a autocomplete list so we can't sanitize it.
                el.attr('autocomplete', 'off');
                p.destroyEvents();
                p.events();

                var caret = p.getCaret();
                p.val(p.getMasked());
                p.setCaret(caret + p.getMCharsBeforeCount(caret, true));

            } else {
                p.events();
                p.val(p.getMasked());
            }
        };

        jMask.init(!el.is('input'));
    };

    $.maskWatchers = {};
    var HTMLAttributes = function() {
            var input = $(this),
                options = {},
                prefix = 'data-mask-',
                mask = input.attr('data-mask');

            if (input.attr(prefix + 'reverse')) {
                options.reverse = true;
            }

            if (input.attr(prefix + 'clearifnotmatch')) {
                options.clearIfNotMatch = true;
            }

            if (input.attr(prefix + 'selectonfocus') === 'true') {
                options.selectOnFocus = true;
            }

            if (notSameMaskObject(input, mask, options)) {
                return input.data('mask', new Mask(this, mask, options));
            }
        },
        notSameMaskObject = function(field, mask, options) {
            options = options || {};
            var maskObject = $(field).data('mask'),
                stringify = JSON.stringify,
                value = $(field).val() || $(field).text();
            try {
                if (typeof mask === 'function') {
                    mask = mask(value);
                }
                return typeof maskObject !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
            } catch (e) {}
        };


    $.fn.mask = function(mask, options) {
        options = options || {};
        var selector = this.selector,
            globals = $.jMaskGlobals,
            interval = $.jMaskGlobals.watchInterval,
            maskFunction = function() {
                if (notSameMaskObject(this, mask, options)) {
                    return $(this).data('mask', new Mask(this, mask, options));
                }
            };

        $(this).each(maskFunction);

        if (selector && selector !== '' && globals.watchInputs) {
            clearInterval($.maskWatchers[selector]);
            $.maskWatchers[selector] = setInterval(function() {
                $(document).find(selector).each(maskFunction);
            }, interval);
        }
        return this;
    };

    $.fn.unmask = function() {
        clearInterval($.maskWatchers[this.selector]);
        delete $.maskWatchers[this.selector];
        return this.each(function() {
            var dataMask = $(this).data('mask');
            if (dataMask) {
                dataMask.remove().removeData('mask');
            }
        });
    };

    $.fn.cleanVal = function() {
        return this.data('mask').getCleanVal();
    };

    $.applyDataMask = function(selector) {
        selector = selector || $.jMaskGlobals.maskElements;
        var $selector = (selector instanceof $) ? selector : $(selector);
        $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
    };

    var globals = {
        maskElements: 'input,td,span,div',
        dataMaskAttr: '*[data-mask]',
        dataMask: true,
        watchInterval: 300,
        watchInputs: true,
        watchDataMask: false,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            '0': { pattern: /\d/ },
            '9': { pattern: /\d/, optional: true },
            '#': { pattern: /\d/, recursive: true },
            'A': { pattern: /[a-zA-Z0-9]/ },
            'S': { pattern: /[a-zA-Z]/ }
        }
    };

    $.jMaskGlobals = $.jMaskGlobals || {};
    globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

    // looking for inputs with data-mask attribute
    if (globals.dataMask) { $.applyDataMask(); }

    setInterval(function() {
        if ($.jMaskGlobals.watchDataMask) { $.applyDataMask(); }
    }, globals.watchInterval);
}));
// on crée une variable pour stocker l'état de AJAX
var ajaxIsRunning = false;

// quand AJAX est déclenché, on fait signe à notre variable
$(document).ajaxStart(function() {
    ajaxIsRunning = true;
});

//quand AJAX a finit son boulot, on fait signe à notre variable
$(document).ajaxStop(function() {
    ajaxIsRunning = false;
});




(function($) {
    "use strict";

    // configure global search
    $('i.primary-search-submit, .right-off-canvas-menu .search i').click(function() {
        if (ValidateInputValue($(this).prev().val())) {
            DoGlobalSearch($(this).prev().val());
        }
    });
    $('input.primary-search-bar, .right-off-canvas-menu .search input').keydown(function(e) {
        if (e.keyCode == 13) {
            if (ValidateInputValue($(this).val())) {
                DoGlobalSearch($(this).val());
            }
        }
    });

    function DoGlobalSearch(searchText) {
        window.location.href = window.location.protocol + "//" + window.location.host + "/search?q=" + encodeURIComponent(searchText);

        if (window.location.host == "investors.amgen.com") {
            window.location.href = window.location.protocol + "//wwwext.amgen.com/search?q=" + encodeURIComponent(searchText);
        }
    }

    function ValidateInputValue(searchText) {
        var regv = /(<([^>]+)>)/gi;
        if (searchText.match(regv)) {
            $(".primary-search-bar").val("");
            return false;
        } else
            return true;
    }

    // variables
    var $searchButton = $('.m-search-results button.search-submit'),
        $searchInput = $('.m-search-results input.search-input'),
        $sortOrderSelect = $('.m-search-results select#sort-by-ddl'),
        $dateFilterCheckboxes = $('.m-search-results input.date-filter'),
        $categoryFilterCheckboxes = $('.m-search-results input.category-filter'),
        $categoryFilterMobileDdl = $('#filter-sort'),
        $currentPage = 0,
        $query = '',
        $queryWithFilters = '',
        $metaValues = null,
        $showPerRequest = 10,
        $sortOrder = '',
        $totalResults = 0,
        $spinnerHtml = '<div id="loading" class="clearfix"><div class="spinner"><div class="cube1"></div><div class="cube2"></div></div></div>',
        $spinnerSelector = '#loading',
        $isActiveSearch = false,
        $currentWaypoint = null;

    // start a new search whenever the user clicks the search button or presses enter in the input
    $searchButton.click(function() {
        if ($searchInput.val().trim() != '') {
            PerformSearch(true, $searchInput.val());
        }
        return false;
    });
    $searchInput.keydown(function(e) {
        if (e.keyCode == 13 && $searchInput.val().trim() != '') {
            PerformSearch(true, $searchInput.val());
            return false;
        }
    });

    // if a search is "Active" and the user switches the Sort By, redo the search
    $sortOrderSelect.change(function() {
        if ($isActiveSearch) {
            PerformSearch(true, $query);
            return false;
        }
    });

    // if a date filter is checked, uncheck all others and re-do the search.
    // if a date filter is unchecked, check Any Date and re-do the search
    $dateFilterCheckboxes.change(function() {
        if ($(this).is(':checked')) {
            $dateFilterCheckboxes.prop('checked', false);
            $(this).prop('checked', true);
            if ($isActiveSearch) {
                PerformSearch(true, $query);
            }
        } else {
            $('#date-filter-any-date').prop('checked', true);
            if ($isActiveSearch) {
                PerformSearch(true, $query);
            }
        }
    });

    $categoryFilterMobileDdl.change(function() {
        $categoryFilterCheckboxes.prop('checked', false);
        $('#' + $(this).val()).prop('checked', true).change();
    });

    // if a category filter is checked or unchecked, re-do the current search so that it 
    // adds the filter (unless "All" is already checked, then do nothing)
    $categoryFilterCheckboxes.change(function() {
        // if the "All" checkbox is already checked and this is not the "All" checkbox, do nothing
        if ($(this).attr('id') != 'category-filter-all' && $('#category-filter-all').is(':checked')) {
            return true;
        }

        // set the meta value by iterating through each category checkbox and extracting its filter value
        $metaValues = '';
        if (!$('#category-filter-all').is(':checked')) {
            $('[data-gsa-filter]').each(function() {
                if ($(this).is(':checked')) {
                    $metaValues += $(this).attr('data-gsa-filter') + '|';
                }
            });
            if ($metaValues.length > 0) {
                $metaValues = $metaValues.substring(0, $metaValues.length - 1);
            }
        }

        if ($metaValues == '') {
            $metaValues = null;
        }

        // re-do the search
        if ($isActiveSearch) {
            PerformSearch(true, $query);
        }
    });

    // turns a javascript date object into a "pretty" date string such as "January 1, 1977"
    function prettyDate(date) {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return monthNames[monthIndex] + ' ' + day + ', ' + year;
    }

    /**
     * Performs a GSA search taking into account the query and any filters applied
     * @param {Boolean} isNewSearch, if true then remove any listed results and start a new search, 
     *                  otherwise append more results to the existing search
     * @param {String} query, the search term as entered by the user in the search textbox
     */
    function PerformSearch(isNewSearch, query) {
        if (isNewSearch) {
            if ($currentWaypoint)
                $currentWaypoint.destroy();
            $isActiveSearch = true;
            $query = query;
            $queryWithFilters = $query;
            // if the "Any Date" checkbox is not checked then we need to add a date filter to the query
            if (!$('#date-filter-any-date').is(':checked')) {
                var today = $('#GsaSearchDateToday').val();
                // past day
                if ($('#date-filter-one-day').is(':checked')) {
                    var yesterday = $('#GsaSearchDateYesterday').val()
                    $queryWithFilters += ' daterange:' + yesterday + '..' + today;
                }
                // past week
                else if ($('#date-filter-one-week').is(':checked')) {
                    var lastWeek = $('#GsaSearchDateWeek').val()
                    $queryWithFilters += ' daterange:' + lastWeek + '..' + today;
                }
                // past month
                else if ($('#date-filter-one-month').is(':checked')) {
                    var lastMonth = $('#GsaSearchDateMonth').val()
                    $queryWithFilters += ' daterange:' + lastMonth + '..' + today;
                }
            }
            $currentPage = 0;
            $sortOrder = $sortOrderSelect.val();
            $totalResults = 0;
            // show the loading HTML and clear any existing search results
            $('#search-results').html('').after($spinnerHtml);
        } else {
            // if this is not a new search then we are just getting more results, iterate the page
            $currentPage++;
            if ($currentPage * $showPerRequest >= $totalResults) {
                $currentWaypoint = null;
                return;
            }
            // show the loading HTML
            $('#search-results').after($spinnerHtml);
        }

        // set the GSA search parameters
        var params = {
            query: $queryWithFilters,
            domain: window.location.hostname,
            resultsPerPage: $showPerRequest,
            currentPageIndex: $currentPage,
            searchCollection: null,
            requiredMetaTag: $metaValues,
            partialMetaTag: null,
            language: 'All',
            inputEncoding: 'Default',
            outputEncoding: 'Default',
            sortOrder: $sortOrder
        };

        var json = JSON.stringify(params);
        $.ajax({
            type: "POST",
            url: "/api/gsa.asmx/Search",
            data: json,
            contentType: "application/json",
            async: true,
            dataType: 'json',
            success: function(data) {
                //alert("data.d" + data.d);
                if (data.d) {
                    // if the search returns data...
                    var results = JSON.parse(data.d);
                    //alert("results" + results);
                    $totalResults = results.TotalResults;
                    //alert("totalResults" + $totalResults);
                    $('#total-results').html(htmlEscape($totalResults));
                    $('#search-query').html(htmlEscape($query));
                    $('.displaying').show();
                    $($spinnerSelector).remove();

                    if (results.TotalResults == 0) {
                        $('#search-results').html('<li><p>No Results Found</p></li>');
                    } else {

                        var resultsHtml = $('#search-results').html();
                        for (var i = 0; i < results.Results.length; i++) {
                            var resultDate = results.Results[i].Date;
                            if (resultDate && resultDate != null) {
                                resultDate = '<div class="date">' + prettyDate(new Date(resultDate)) + '</div>';
                            } else {
                                resultDate = ''
                            }
                            var resultTitle = results.Results[i].Title;
                            if (!resultTitle || resultTitle.trim() == '') {
                                resultTitle = results.Results[i].Url;
                            }
                            resultsHtml += '<li id="result-' + results.Results[i].ResultNumber +
                                '" class="result">' + resultDate + '<h4><a href="' + results.Results[i].Url + '">' +
                                resultTitle + '</a></h4><p>' + results.Results[i].Description +
                                '</p></li>';
                        }
                        $('#search-results').html(resultsHtml);

                        // set up the waypoint to get more results halfway down the new search results
                        $currentWaypoint = $('#result-' + (Number(results.Results[0].ResultNumber) + $showPerRequest / 2)).waypoint({
                            handler: function(direction) {
                                PerformSearch(false, $query);
                                this.destroy()
                            },
                            offset: 'bottom-in-view'
                        })[0];
                    }
                }
            }
        });
    }

    // HTML Encode/Decode method from http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
    function htmlEscape(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function htmlUnescape(value) {
        return String(value)
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    }

})(jQuery);

(function($) {
    "use strict";

    // only do all this on a page with a tabbed grid item
    if ($('.m-tabbed-grid').length > 0) {
        // variables
        var tabs = $('.m-tabbed-grid .tabs a');
        var panels = $('.m-tabbed-grid .tabbed-panel');
        var griditems = panels.find('.grid-item');

        // make sure the last grid item has the "end" class so it doesnt float right
        griditems.filter(':last-child').addClass('end');

        // by default show only the first panel and set the forst tab as active
        tabs.first().addClass('active');
        panels.first().show();

        // set the tab click event
        tabs.click(function() {
            // set the clicked tab as active
            tabs.removeClass('active');
            $(this).addClass('active');
            // get the id of the panel to show
            var gridid = 'panel-' + $(this).attr('id').replace('link-', '');
            // show only the panel for this tab
            panels.hide();
            $('#' + gridid).show();
        });

        // ste the click event for the individual grid-items
        griditems.click(function() {
            // will this grid item trigger a modal?  Only if IsModal is selected in Sitecore AND we are in desktop view
            var isModal = $(this).find('.item-ismodal').val();
            if (isModal == '1' && $(window).width() > 641) {
                // prepare the modal by setting its title, subtitle, text and image
                var modal = $('.tabbed-grid-modal').first();
                modal.find('.modal-title').html($(this).find('.item-title').html());
                modal.find('.modal-subtitle').html($(this).find('.item-subtitle').html());
                modal.find('.modal-text').html($(this).find('.item-text').val().replace(/_QUOT\^TOKEN_/g, '"'));
                if ($(this).find('img').length == 0) {
                    modal.find('.modal-image').hide().next().removeClass('medium-7').removeClass('large-8');
                } else {
                    modal.find('.modal-image').show().next().addClass('medium-7').addClass('large-8');
                    modal.find('.modal-image img').attr('src', $(this).find('img').attr('src'));
                }
                // show the modal
                modal.foundation('reveal', 'open');
            } else {
                // no modal, redirect to the item page
                window.location.href = $(this).find('.item-url').val();
            }
        });

        // hash's at the end of the url can triger a certain tab to be active or a certain grid item to be opened
        if (window.location.hash && window.location.hash.length > 0) {
            var item = $('[data-hash-param=' + window.location.hash.substring(1, window.location.hash.length) + ']').first();
            var parentName = item.attr('data-parent-hash-param');
            if (parentName && parentName.length > 0) {
                $('[data-hash-param=' + parentName + ']').first().click();
            }
            item.click();
        }
    }
})(jQuery);

(function($) {
    "use strict";

    $(document).ready(function() {

        var $allNav = $("#search-nav, #global-nav, #more-nav"),
            $allDropdowns = $("#dropdown-search, #dropdown-global, #dropdown-more"),
            $navItemLi = $(".m-main-menu > ul > li"),
            $navItemLiTitles = $navItemLi.find('a.nav-item-title'),
            $dropdown = $('.sub-menu-dropdown');

        //On Click outside the dropdown hide dropdown
        $('html').click(function() {
            $allNav.removeClass('active');
            $allDropdowns.hide();
            //$navItemLi.removeClass('active');
        });
        $('html').on('touchstart', function() {
            $navItemLi.removeClass('active');
        });
        $allNav.on("touchstart click", function(e) {
            e.stopPropagation();
        });
        $dropdown.on("touchstart click", function(e) {
            e.stopPropagation();
        });
        $navItemLiTitles.on("touchstart", function(e) {
            e.stopPropagation();
        });

        $allNav.each(function(index) {
            $(this).on("touchstart click", function(e) {
                var dropdown = $allDropdowns.eq(index);
                if (dropdown.is(':visible')) {
                    $allNav.removeClass('active');
                    $allDropdowns.hide();
                } else {
                    $allDropdowns.hide();
                    dropdown.hide();
                    $allNav.removeClass('active');
                    $(this).addClass('active');
                    dropdown.show();
                    if (index == 0) {
                        $('input.primary-search-bar').focus();
                    }
                }
                e.preventDefault();
            });
        });

        //Main Nav Active and Dropdown Show
        $navItemLi.on("touchstart mouseenter mouseleave", function(e) {
            if ($(this).closest(".nav-item").hasClass("active") && $(this).hasClass("nav-item")) {
                $(this).closest(".nav-item").removeClass("active");
            } else if ($(this).hasClass("nav-item") && !$(this).hasClass("logo")) {
                $navItemLi.removeClass("active");
                $(this).closest(".nav-item").addClass("active");
            }
        });

        // this empty event handler is needed so that the off canvas menu works on iOS
        $('.right-off-canvas-toggle').click(function() {});
    });
})(jQuery);

(function($) {
    "use strict";

    // $(document).foundation();

    // cookie consent box
    $('#cookieconsentformbox #showhide').click(function() {
        $('#cookieconsentformbox').remove();
        $('footer div.primary').css('margin-bottom', '');
    });
    if ($('#cookieconsentformbox').is(':visible')) {
        $('footer div.primary').css('margin-bottom', $('#cookieconsentformbox').height() + 'px');
    }

    // set cookie modal behaviour
    var cookieModalCookieName = 'CookieModalVisibility';
    var cookieModalCookieValue = '1';

    if (cookieModalCookieValue != $.cookie(cookieModalCookieName)) {
        $('#cookie-consent-modal').foundation('reveal', 'open');
    }

    $('#close-cookie-consent-modal, .modal-close ').click(function() {
        $.cookie(cookieModalCookieName, cookieModalCookieValue, { expires: 60 });
        $('#cookie-consent-modal').foundation('reveal', 'close');
        return false;
    });

    // all items with a class of "external-link" will have a interstitial modal
    // $('a.external-link').click(function() {
    // var url = $(this).attr('href');
    // $('#leave-site-modal').foundation('reveal', 'open');
    // $('#leave-site-modal a.external-link-modal-link').attr('href', url);
    // return false;
    // });
    $('#leave-site-modal a.external-link-modal-link').click(function() {
        $('#leave-site-modal').foundation('reveal', 'close');
        return true;
    });
    $('#close-leave-site-modal').click(function() {
        $('#leave-site-modal').foundation('reveal', 'close');
        return false;
    });

    // all items with a class of "video-amgen-link" will have a interstitial modal
    $('a.video-amgen-link').click(function() {
        var src = $(this).attr('src');
        var vid = $(this).find('.v-id').text();
        $('#video').foundation('reveal', 'open');
        $('#video iframe').attr('src', "http://players.brightcove.net/4360108603001/NyQyCuXtx_default/index.html?videoId=" + vid);
        return false;
    });

    // Redirection in amgen external link modal
    var timer = $('#leave-site-amgen-modal #timer');
    var redirect;

    function playRedirectionTimer(link) {
        redirect = setTimeout(function() {
            window.open(link, '_blank');
        }, 10000);
    }

    function stopRedirectionTimer() {
        clearTimeout(redirect);
    }

    // Click outside the modal
    // Stops the timerfor the redirection
    // http://stackoverflow.com/questions/1403615/use-jquery-to-hide-a-div-when-the-user-clicks-outside-of-it?page=1&tab=votes#tab-top
    $(document).mouseup(function(e) {
        var container = $("#leave-site-amgen-modal");

        if (!container.is(e.target) // if the target of the click isn't the container...
            &&
            container.has(e.target).length === 0 // ... nor a descendant of the container
            &&
            timer) // Redirection timer is used
        {
            stopRedirectionTimer();
        }
    });

    $('.close-reveal-modal').click(function() {
        if (timer) {
            stopRedirectionTimer();
        }
    });

    // all items with a class of "external-amgen-link" will have a interstitial modal
    $('a.external-amgen-link').click(function() {
        var url = $(this).attr('href');
        $('#leave-site-amgen-modal').foundation('reveal', 'open');
        $('#leave-site-amgen-modal a.external-amgen-link-modal-link').attr('href', url);

        if (timer) {
            playRedirectionTimer(url);
        }

        return false;
    });
    $('#leave-site-amgen-modal a.external-amgen-link-modal-link').click(function() {
        $('#leave-site-amgen-modal').foundation('reveal', 'close');

        if (timer) {
            stopRedirectionTimer();
        }
        return true;
    });
    $('#close-leave-site-amgen-modal').click(function() {
        $('#leave-site-amgen-modal').foundation('reveal', 'close');

        if (timer) {
            stopRedirectionTimer();
        }

        return false;
    });

    // all items with a class of "external-prolia-link" will have a interstitial modal
    $('a.external-prolia-link').click(function() {
        var url = $(this).attr('href');
        $('#leave-site-prolia-modal').foundation('reveal', 'open');
        $('#leave-site-prolia-modal a.external-prolia-link-modal-link').attr('href', url);
        return false;
    });
    $('#leave-site-prolia-modal a.external-prolia-link-modal-link').click(function() {
        $('#leave-site-prolia-modal').foundation('reveal', 'close');
        return true;
    });
    $('#close-leave-site-prolia-modal').click(function() {
        $('#leave-site-prolia-modal').foundation('reveal', 'close');
        return false;
    });

    // all items with a class of "external-prolia-link" will have a interstitial modal
    $('a.external-hcp-link').click(function() {
        var url = $(this).attr('href');
        $('#leave-site-hcp-modal').foundation('reveal', 'open');
        $('#leave-site-hcp-modal a.external-hcp-link-modal-link').attr('href', url);
        return false;
    });
    $('#leave-site-hcp-modal a.external-hcp-link-modal-link').click(function() {
        $('#leave-site-hcp-modal').foundation('reveal', 'close');
        return true;
    });
    $('#close-leave-site-hcp-modal').click(function() {
        $('#leave-site-hcp-modal').foundation('reveal', 'close');
        return false;
    });

    // Get rid of the BotDetect link and tooltip from all captchas
    $('img.LBD_CaptchaImage').parent().attr('href', 'javascript:void(0);').attr('title', '').attr('onclick', '').css('cursor', 'default');

})(jQuery);