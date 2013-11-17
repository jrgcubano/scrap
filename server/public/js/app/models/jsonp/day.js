define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),

        Day = Backbone.Model.extend({

            urlRoot: "http://localhost:3000/days",

            initialize: function () {
                // TODO
            }

        }),

        DayCollection = Backbone.Collection.extend({

            model: Day,

            url: "http://localhost:3000/days"

        }),

        originalSync = Backbone.sync;

    Backbone.sync = function (method, model, options) {
        if (method === "read") {
            options.dataType = "jsonp";
            return originalSync.apply(Backbone, arguments);
        }
    };

    return {
        Day: Day,
        DayCollection: DayCollection
    };

});