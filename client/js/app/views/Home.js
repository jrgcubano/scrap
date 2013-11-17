define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        DayListView    = require('app/views/DayList'),
        models              = require('app/models/day'),
        tpl                 = require('text!tpl/Home.html'),

        template = _.template(tpl);


    return Backbone.View.extend({

        initialize: function () {
            this.dayList = new models.DayCollection();
            this.render();
        },

        render: function () {
            this.$el.html(template());
            this.dayList.fetch({reset: true, data: {name: ""}});
            this.listView = new DayListView({collection: this.dayList, el: $(".scroller", this.el)});
            return this;
        }

    });

});