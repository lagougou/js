(function($) {
    'use strict'

    function Slider($elem, opts) {
        this.$index = opts.activeIndex;
        this.$elem = $elem;
        // this.timer = null;
        this.moved = false;
        this.$slider = this.$elem.find('.slider-item');
        this.$indicator = this.$elem.find('.slider-indicator-item');
        this.$nextbtn = this.$elem.find('.right-button');
        this.$prvbtn = this.$elem.find('.left-button');


        this._init($elem, opts);

        this.startAutoMove();


        // console.log(this.$sliderWidth);
        // var proxy = this;



    }

    Slider.prototype._init = function($elem, opts) {
        var proxy = this;

        this.$indicator.on('click', function() {
            if (proxy.$index != $(this).index()) {
                // proxy.$index = $(this).index();
                proxy.moveTo($(this).index());
            }

            return false;
        });

        this.$nextbtn.on('click', $.proxy(this.clickMoveNext, this));
        this.$prvbtn.on('click', $.proxy(this.movePrevious, this));

        this.$indicator.removeClass('slider-indicator-active');
        this.$indicator.eq(this.$index).addClass('slider-indicator-active');

        if (opts.animate === "fade") {
            this.$elem.addClass('slider-fade');
            this.$slider.eq(this.$index).show();
        } else if (opts.animate === 'slide') {
            this.$elem.addClass('slider-slide');
            this.$sliderWidth = this.$elem.width();
        }

        this.$slider.showHide(opts);
    }

    Slider.prototype.moveNext = function() {
        // this.$index++;
        // if (this.$index >= this.$indicator.length) this.$index = 0;
        this.animate(this.$index + 1);
    }

    Slider.prototype.clickMoveNext = function() {
        this.clearTimer();
        this.moveNext();
        this.startAutoMove();
        return false;
    }

    Slider.prototype.movePrevious = function() {
        this.clearTimer();
        // this.$index--;
        // if (this.$index < 0) this.$index = this.$indicator.length - 1;
        this.animate(this.$index - 1);
        this.startAutoMove();
        return false;
    }

    Slider.prototype.moveTo = function(index) {
        this.clearTimer();
        console.log(this.$index);
        this.animate(index);
        this.startAutoMove();
    }

    Slider.prototype.animate = function(index) {

        // this.$slider.animate({ 'left': -(this.$sliderWidth * this.$index) }, 300);
        if (index >= this.$indicator.length) index = 0;
        if (index < 0) index = this.$indicator.length - 1;
        this.$slider.eq(this.$index).showHide('hide');
        this.$slider.eq(index).showHide('show');
        this.$indicator.eq(this.$index).removeClass('slider-indicator-active');
        this.$indicator.eq(index).addClass('slider-indicator-active');
        this.$index = index;
    }

    Slider.prototype.autoMove = function() {
        var proxy = this;
        if (this.moved) {
            this.timer = setInterval(function() {
                proxy.moveNext();
            }, 3000);
        }
    }

    Slider.prototype.clearTimer = function() {
        if (this.moved && this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
            this.moved = !this.moved;
        }
    }

    Slider.prototype.startAutoMove = function() {
        // body...
        if (!this.moved && !this.timer) {
            this.moved = true;
            this.autoMove();
        }
    }


    Slider.DEFAULTS = {
        css3: true,
        js: false,
        animate: 'fade',
        activeIndex: 0
    };

    $.fn.extend({
        slide: function(option) {
            return this.each(function() {
                console.log($(this));
                var $this = $(this),
                    slide = $this.data('slide'),
                    options = $.extend({}, Slider.DEFAULTS, $(this).data(), typeof option === 'object' && option);



                if (!slide) {
                    $this.data('slide', slide = new Slider($this, options));
                }
                // console.log(slide);
                if (typeof slide[option] === 'function') {
                    slide[option]();
                }
            });
        }
    });

})(jQuery);