/*jslint node: true */
define([], function() {
"use strict";

var Scope = function() {
  this.$$watchers = [];
  this.$parent = null;
  this.$root = this;
};

Scope.prototype = {
  constructor: Scope,
  $new: function(isolate) {
    var child,
        Child = function() {};

    if(isolate) {
      child = new Scope();
      child.$root = this.$root;
    } else {
      Child.prototype = this;
      child = new Child();
    }
    child.$parent = this;
    return child;
  },

  $watch: function(watchExp, listener) {
    var scope = this,
        watcher = {
          watchExp: watchExp,
          listener: listener,
          last: null
        };

    scope.$$watchers.unshift(watcher);
  },

  // $watchCollection: function() {

  // },

  $digest: function() {
    var scope = this;
    scope.$$watchers.forEach(function(watcher){
      var newVal = scope.$eval(watcher.watchExp);
      if(watcher.last !== newVal) {
        watcher.listener(newVal, watcher.last, scope);
        watcher.last = newVal;
      }
    });
  },

  $apply: function(expFn) {
    try {
      expFn();
    } catch (e) {
      // $exceptionHandler(e)
    } finally {
      $rootScope.$digest();
    }
  },

  $eval: function (exp) {
    var val;
    if (typeof exp === 'function') {
      val = exp.call(this);
    } else {
      try {
        val = function(exp) {
          return eval('this.' + exp);
        }.call(this, exp);
      } catch (e) {
        val = undefined;
      }
    }
    return val;
  }

  //$on
  //$emit
  //$boardcast

};

var $rootScope = new Scope();
return $rootScope;

});