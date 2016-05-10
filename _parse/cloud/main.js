/* global Parse */
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
var regressionCoefficient = require('cloud/regressionParameter.js')
var _ = require('cloud/lodash.min.js')
Parse.Cloud.define('compute', function (request, response) {
  var params = request.params

  var sumCompany = 0
  var companyCount = 13
  _.times(companyCount, function (index) {
    sumCompany += regressionCoefficient[index + 1]
  })
  var avgCompany = sumCompany / companyCount

  var regression = 0
  regression += avgCompany
  _.each(params, function (value, key) {
    var coefficient = regressionCoefficient[key]
    regression += coefficient * value
  })
  var output = 1 / (1 / Math.exp(regression) + 1)
  response.success(output)
})
