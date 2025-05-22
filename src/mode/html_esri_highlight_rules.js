"use strict";

var oop = require("../lib/oop");
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;

var HtmlEsriHighlightRules = function () {
    HtmlHighlightRules.call(this);

    // Yann:
    // Add rules to the beginning of js-no_regex
    // js-no_regex recognizes the beginning of strings starting with a quote or a single quote.
    // What we do is specifying what we are looking for after the quotes, an id with 32 character, ending with the matching quote.
    this.$rules["js-no_regex"].unshift(
        {
            token: "string",
            regex: /"(?=[0-9a-fA-F]{32}")/, // recognizes an id starting w/ double quote like: "971eae060595416283eaac4ad54cbbda"
            next: "js-qqesri.portal.item" // delegate to state js-qqportalitem to highlight the actual id
        },
        {
            token: "string",
            regex: /'(?=[0-9a-fA-F]{32}')/, // recognizes an id starting w/ single quote like:  '971eae060595416283eaac4ad54cbbda'
            next: "js-qesri.portal.item" // delegate to state js-qportalitem to highlight the actual id
        },
        {
            token: "string",
            regex: /"(?=esri(\/\w+)+")/,
            next: "js-qqesri.mid"
        },
        {
            token: "string",
            regex: /'(?=esri(\/\w+)+')/,
            next: "js-qesri.mid"
        },
        {
            token: "string",
            regex: /"(?=@arcgis(\/\w+)+\.js")/,
            next: "js-qqesri.core"
        },
        {
            token: "string",
            regex: /'(?=@arcgis(\/\w+)+\.js')/,
            next: "js-qesri.core"
        },

        {
            token: "string",
            regex: /"(?=https?[^"]+")/,
            next: "js-qqesri.url"
        },
        {
            token: "string",
            regex: /'(?=https?[^']+')/,
            next: "js-qesri.url"
        }
    );

    this.$rules["css-start"].unshift({
        token: "keyword.keyword-css", // add keyword-css in order to specify id selectors
        regex: /#[-a-z0-9_]+/,
        next: "css-start"
    });

    this.addRules({
        "js-qqesri.portal.item": [
            {
                token: "esri-portal-item-id-href",
                regex: /[0-9a-fA-F]{32}/, // recognizes the id 971eae060595416283eaac4ad54cbbda
                next: "js-qqstring" // deletate to js-qstring to highlight the end quote
            }
        ],
        "js-qqesri.mid": [
            {
                token: "esri-mid-href",
                regex: /esri(\/\w+)+/,
                next: "js-qqstring"
            }
        ],
        "js-qqesri.core": [
            {
                token: "esri-core-href",
                regex: /@arcgis(\/\w+)+\.js/,
                next: "js-qqstring"
            }
        ],
        "js-qesri.portal.item": [
            {
                token: "esri-portal-item-id-href",
                regex: /[0-9a-fA-F]{32}/, // recognizes the id 971eae060595416283eaac4ad54cbbda
                next: "js-qstring" // deletate to js-qstring to highlight the end quote
            }
        ],
        "js-qesri.mid": [
            {
                token: "esri-mid-href",
                regex: /esri(\/\w+)+/,
                next: "js-qstring"
            }
        ],
        "js-qesri.core": [
            {
                token: "esri-core-href",
                regex: /@arcgis(\/\w+)+\.js/,
                next: "js-qstring"
            }
        ],
        "js-qqesri.url": [
            {
                token: "esri-url-href",
                regex: /https?:\/\/[-=*:+_.?&~{}@%#()\w\d/]+/,
                next: "js-qqstring"
            }
        ],
        "js-qesri.url": [
            {
                token: "esri-url-href",
                regex: /https?:\/\/[-=*:+_.?&~{}@%#()\w\d/]+/,
                next: "js-qstring"
            }
        ],

    });

    // --------------------------------------------------------------------
    // Add rules to the beginning of tag for arcgis-web-component and calcite-web-component
    // --------------------------------------------------------------------
    this.$rules["tag"].unshift(
        {
            token : function(start, tag) {
                return ["meta.tag.punctuation.arcgis-web-component." + (start == "<" ? "" : "end-") + "tag-open.xml",
                    "meta.tag.arcgis-web-component.tag-name.xml"];
            },
            regex : "(</?)(arcgis-[-_a-zA-Z0-9:.]+)",
            next: "tag_stuff"
        },
        {
            token : function(start, tag) {
                return ["meta.tag.punctuation.calcite-web-component." + (start == "<" ? "" : "end-") + "tag-open.xml",
                    "meta.tag.calcite-web-component.tag-name.xml"];
            },
            regex : "(</?)(calcite-[-_a-zA-Z0-9:.]+)",
            next: "tag_stuff"
        });
    this.$rules["tag_stuff"].push({
        token : "meta.tag.punctuation.arcgis-web-component.tag-close.xml", regex : "/?>", next : "start"
    },{
        token : "meta.tag.punctuation.calcite-web-component.tag-close.xml", regex : "/?>", next : "start"
    });

    // --------------------------------------------------------------------
    // Add rules to the beginning of attribute_value for esri-guid-attribute-value
    // --------------------------------------------------------------------
    this.$rules["attribute_value"].unshift({
        token: "string.esri-guid-attribute-value.xml",
        regex: /["'][0-9a-fA-F]{32}/,
        push : [
            {token : "string.attribute-value.xml", regex: /["']/, next: "pop"},
            {include : "attr_reference"},
            {defaultToken : "string.attribute-value.xml"}
        ]
    });


    if (this.constructor === HtmlEsriHighlightRules) this.normalizeRules();
};

oop.inherits(HtmlEsriHighlightRules, HtmlHighlightRules);

exports.HtmlEsriHighlightRules = HtmlEsriHighlightRules;
