"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

$(document).ready(function () {
  if( $('.quantum-tabs__label--selected').length < 1 ){
    $('.quantum-tabs li:first').addClass('quantum-tabs__label--selected');
  }
  $('.quantum-tabs').each(function () {
    var tabsvar = $(this).data('tabsvar');

    if (tabsvar != undefined && tabsvar != "") {
      $(this).addClass(tabsvar);
    }

    if( $('.quantum-tabs__label--selected').length < 1 ){
      $('this li:first').addClass('quantum-tabs__label--selected');
    }
  });
  var isPreventClick = false;
  $('.preventClick').on('click', function () {
    isPreventClick = true;
  });
  $('.quantum-tabs__label-text').click(function (e) {
    var href = $(this).attr('href');

    if (isPreventClick) {
      isPreventClick = false;
      return;
    } else {
      isPreventClick = false;
    }

    if (href.length) {
      $(this).parents('.quantum-tabs__labels').siblings('.quantum-tabs__panes').children('.quantum-tabs__pane').removeClass('quantum-tabs__pane--visible');
      $(href).addClass('quantum-tabs__pane--visible');
      $(this).parents('.quantum-tabs__label').removeClass('quantum-tabs__label--selected');
      $(this).parents('.quantum-tabs__label').siblings().removeClass('quantum-tabs__label--selected');
      $(this).parents('.quantum-tabs__label').addClass('quantum-tabs__label--selected');
    }

    e.preventDefault();
  });
});

var QuantumTabs = /*#__PURE__*/function () {
  function QuantumTabs(tabs) {
    _classCallCheck(this, QuantumTabs);

    this.paneVisibleClass = 'quantum-tabs__pane--visible';
    this.tabClass = 'quantum-tabs__label';
    this.selectedTabClass = 'quantum-tabs__label--selected';
    this.tabset = tabs;
    this.paneTriggers = this.tabset.querySelectorAll('.quantum-tabs__label-text');
    this.addEventListeners();
    this.setDefaultTab();
  }

  _createClass(QuantumTabs, [{
    key: "setDefaultTab",
    value: function setDefaultTab() {
      var selectedTab = this.tabset.querySelector("." + this.selectedTabClass);

      if (!selectedTab) {
        // If nothing's selected, default to the first tab
        var firstTab = this.tabset.querySelector("." + this.tabClass);
        var firstTabLink = firstTab.querySelector('.quantum-tabs__label-text');
        var paneId = firstTabLink.getAttribute('href').replace('#', '');
        this.showPane(paneId);
        firstTab.classList.add(this.selectedTabClass);
      }
    }
  }, {
    key: "hideAllVisiblePanes",
    value: function hideAllVisiblePanes() {
      var _this = this;

      var visiblePanes = this.tabset.querySelectorAll("." + this.paneVisibleClass);
      visiblePanes.forEach(function (p) {
        return p.classList.remove(_this.paneVisibleClass);
      });
      var selectedTabs = this.tabset.querySelectorAll("." + this.selectedTabClass);
      selectedTabs.forEach(function (t) {
        return t.classList.remove(_this.selectedTabClass);
      });
    }
  }, {
    key: "showPane",
    value: function showPane(paneId) {
      this.hideAllVisiblePanes();
      var pane = this.tabset.querySelector("#" + paneId);
      pane.classList.add(this.paneVisibleClass);
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      var _this2 = this;

      
      Array.prototype.slice.call(this.paneTriggers).forEach(function (t) {
        t.addEventListener('click', function (e) {
          e.preventDefault(); // if(e.target.hasChildNodes()){
          // if(e.target.children[0].classList[0] != "preventClick") {

          if (e.target.getAttribute('href')) {
            var paneId = e.target.getAttribute('href').replace('#', '');

            _this2.showPane(paneId);
          }

          e.target.parentNode.classList.add(_this2.selectedTabClass); //   }
          // }
        });
      });
    }
  }]);

  return QuantumTabs;
}();

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function () {
  var quantumTabs = document.querySelectorAll('.quantum-tabs');
  Array.prototype.slice.call(quantumTabs).forEach(function (t) {
    new QuantumTabs(t);
  });
});