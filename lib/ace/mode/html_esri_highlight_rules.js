/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
  'use strict';

  var oop = require('../lib/oop');
  var HtmlHighlightRules = require('./html_highlight_rules').HtmlHighlightRules;

  var HtmlEsriHighlightRules = function() {
    HtmlHighlightRules.call(this);

    // Yann:
    // Add rules to the beginning of js-no_regex
    // js-no_regex recognizes the beginning of strings starting with a quote or a single quote.
    // What we do is specifying what we are looking for after the quotes, an id with 32 character, ending with the matching quote.
    this.$rules['js-no_regex'].unshift(
      {
        token: 'string',
        regex: /"(?=[0-9a-fA-F]{32}")/, // recognizes an id starting w/ double quote like: "971eae060595416283eaac4ad54cbbda"
        next: 'js-qqesri.portal.item', // delegate to state js-qqportalitem to highlight the actual id
      },
      {
        token: 'string',
        regex: /'(?=[0-9a-fA-F]{32}')/, // recognizes an id starting w/ single quote like:  '971eae060595416283eaac4ad54cbbda'
        next: 'js-qesri.portal.item', // delegate to state js-qportalitem to highlight the actual id
      },
      {
        token: 'string',
        regex: /"(?=esri(\/\w+)+")/,
        next: 'js-qqesri.mid',
      },
      {
        token: 'string',
        regex: /'(?=esri(\/\w+)+')/,
        next: 'js-qesri.mid',
      },
    );

    this.$rules['css-start'].unshift({
      token: 'keyword.keyword-css', // add keyword-css in order to specify id selectors
      regex: /#[-a-z0-9_]+/,
      next: 'css-start',
    });

    this.addRules({
      'js-qqesri.portal.item': [
        {
          token: 'esri-portal-item-id-href',
          regex: /[0-9a-fA-F]{32}/, // recognizes the id 971eae060595416283eaac4ad54cbbda
          next: 'js-qqstring', // deletate to js-qstring to highlight the end quote
        },
      ],
      'js-qqesri.mid': [
        {
          token: 'esri-mid-href',
          regex: /esri(\/\w+)+/,
          next: 'js-qqstring',
        },
      ],
      'js-qesri.portal.item': [
        {
          token: 'esri-portal-item-id-href',
          regex: /[0-9a-fA-F]{32}/, // recognizes the id 971eae060595416283eaac4ad54cbbda
          next: 'js-qstring', // deletate to js-qstring to highlight the end quote
        },
      ],
      'js-qesri.mid': [
        {
          token: 'esri-mid-href',
          regex: /esri(\/\w+)+/,
          next: 'js-qstring',
        },
      ],
    });

    if (this.constructor === HtmlEsriHighlightRules) this.normalizeRules();
  };

  oop.inherits(HtmlEsriHighlightRules, HtmlHighlightRules);

  exports.HtmlEsriHighlightRules = HtmlEsriHighlightRules;
});
