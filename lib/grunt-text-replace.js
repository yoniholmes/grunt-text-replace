var gruntTextReplace = {};

exports.replace = function (settings) {
  return settings.res
}



textReplaceHelper: function (fullText, from, to) {
  var regex = plugin.convertPatternToRegex(from);
  var expandedReplacement = plugin.expandReplacement(to);
  return fullText.replace(regex, expandedReplacement);
},


convertPatternToRegex: function (pattern) {
  var regexCharacters = '\\[](){}^$-.*+?|,/';
  if (typeof pattern === 'string') {
    regexCharacters.split('').forEach(function (character) {
      var characterAsRegex = new RegExp('(\\' + character + ')', 'g');
      pattern = pattern.replace(characterAsRegex, '\\$1');
    });
    pattern = new RegExp(pattern, 'g');
  } 
  return pattern;
},

expandReplacement: function (replacement) {
  if (typeof replacement === 'function') {
    return this.expandFunctionReplacement(replacement);
  } else if (typeof replacement === 'string') {
    return this.expandStringReplacement(replacement);
  }
},

expandFunctionReplacement: function (replacement) {
  return function () {
    var matchedSubstring = arguments[0];
    var index = arguments[arguments.length - 2];
    var fullText = arguments[arguments.length - 1];
    var regexMatches = Array.prototype.slice.call(arguments, 1,
      arguments.length - 2);
    var returnValue = replacement(matchedSubstring, index, fullText, 
      regexMatches);
    return (typeof returnValue === 'string') ? 
      grunt.template.process(returnValue) : returnValue;
  };
},

expandStringReplacement: function (replacement) {
  return grunt.template.process(replacement);
}