(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'replacer', 'libs/querystring'], factory);
    } else {
        // RequireJS isn't being used. Assume backbone is loaded in <script> tags
        factory(jQuery);
    }
}(function ($, replacer, q) {
        var Wizard = function (element, options) {
            var _options = this.options = $.extend({}, $.fn.wiz.defaults, options)
            this.$fieldsets = $(this.options.fieldset, element);
            if (this.$fieldsets.length < 2){
                return
            }
            this.$el = $(element).addClass('wiz');
            this.$el.last().addClass('tab-content')
            this.$el.prepend('<ul class="nav nav-pills '+this.options.clsNames+' steps" style="margin-right:1em;margin-top:1em"></ul>');
            this.$el.addClass('tab-content tabbable');

            var $ul = this.$ul = $('.steps', this.$el);
            var titleTemplate = this.options.titleTemplate;
            var listItemTemplate = this.options.listItemTemplate;
            this.$steps = $('<li class="nav-header"></li>');
            $ul.append(this.$steps);
            function current() {
                var h = window.location.hash;
                var obj = q.parse(h.substring(h.indexOf('?') + 1));
                return  _options.current || _options.stepKey && obj[_options.stepKey] && parseInt(obj[_options.stepKey]) - 1 || 0;
            }

            this.current = current();
            function hash(s) {
                if (_options.stepKey == null)
                    return window.location.hash
                var h = window.location.hash;
                var idx = h.indexOf('?');
                var path = (0 > idx) ? h : h.substring(0, idx + 1);
                var obj = q.parse(h.substring(path.length));
                obj[_options.stepKey] = s;
                if (path[path.length -1] != '?')
                    path = path+'?'
                return path + q.stringify(obj)
            }

            this.steps = this.$fieldsets.hide().each(
                function (i, e) {
                    var l = i;
                    $(this).addClass('tab-pane').data('step', l);
                    var $legend = $('legend', this);
                    var s = i + 1;
                    var html = replacer(titleTemplate, {step:s, title:$legend.html()});
                    var title = $legend.parent().attr('title');
                    if (title) {
                        $legend.html(title);
                    }
                    var $li = $(replacer(listItemTemplate, {step:s, content:html, stepKey:_options.stepKey, hash:hash(s)})).data('step', l);
                    $ul.append($li)
                }).length;
            var $btns = $('<div class="btn-group pull-right"></div>').append(
                (this.$prev = $('<button class="btn prev">' + this.options.prev + '</button>')),
                (this.$next = $('<button class="btn next btn-primary">' + this.options.next + '</button>')))
            if (this.options.replace)
                $(this.options.replace).replaceWith($btns);
            else
                this.$el.append($btns);

            var self = this;
            this.$prev.on('click', $.proxy(this.goPrev, this));
            this.$next.on('click', $.proxy(this.goNext ,this));
            this.$el.on('click', 'a.step', function (e) {
                self.step($(e.currentTarget).parent().data('step'));
            });
            this.step(this.current);
        }
        Wizard.prototype.goNext = function(){
            if (this.current + 1 < this.steps) {
                this.step(this.current + 1);
            }else{
                this.$next.toggleClass('save', true    ).toggleClass(this.options.doneCls, true);
            }
        }
        Wizard.prototype.goPrev = function(){
            if (this.current > 0)
                this.step(this.current - 1);

        }
        Wizard.prototype.removeStepKey = function(){
             var h = window.location.hash;
             var idx = h.indexOf('?');
             var path = (0 > idx) ? h : h.substring(0, idx + 1);
             var obj = q.parse(h.substring(path.length));
             delete obj[this.options.stepKey];
             if (path[path.length -1] != '?')
                   path = path+'?'
             return window.location.hash =path + q.stringify(obj)
        }
        Wizard.prototype.step = function (pos) {
            pos = pos || 0;
            this.current = pos;
            this.$steps.html(replacer(this.options.steps, {current:this.current + 1, steps:this.steps}));
            var isFin = pos == this.$fieldsets.length - 1;
            this.$next.html(isFin ? this.options.done : this.options.next);

            this.$prev[pos == 0 ? 'addClass' : 'removeClass']('disabled')
            var trans = this.options.transition;
            var $hide = this.$fieldsets.filter('.jwizshow');
            var $show = this.$fieldsets.filter(function () {
                 return $(this).data('step') == pos;
            }).addClass('jwizshow');

            if ($hide.length)
                $hide.removeClass('jwizshow').hide(trans, function(){
                    $show.show(trans);
                })
            else{
               $show.show(trans);
            }
            $('li', this.$ul).removeClass('active').each(function () {
                if ($(this).data('step') == pos)
                    $(this).addClass('active');

            });
        }
        ;
        $.fn.wiz = function (option) {
            var args = Array.prototype.slice.call(arguments, 1);
            return this.each(function (s) {
                var $this = $(this)
                    , data = $this.data('wiz')
                    , options = typeof option == 'object' && option || {
                        next:$this.attr('data-next'),
                        prev:$this.attr('data-prev'),
                        done:$this.attr('data-done'),
                        titleTemplate:$this.attr('data-title-template'),
                        listItemTemplate:$this.attr('data-list-item-template')
                    };
                if (!data) $this.data('wiz', (data = new Wizard(this, options)))
                if (typeof option == 'string')
                    data[option].apply(data, args);
            })
        }

        $.fn.wiz.defaults = {
           // stepKey:'_step',
            titleTemplate:'<b>Step {step}</b>: {title}',
            listItemTemplate:'<li><a  class="step" href="{hash}">{content}</a></li>',
            next:'Next &raquo;',
            prev:'&laquo; Previous',
            done:'Finish',
            doneCls:'ok',
            steps:'Step {current} of {steps}',
            clsNames:'nav-stacked span3',
            fieldset:'fieldset',
            transition:'fast'
        }

    }
))
;