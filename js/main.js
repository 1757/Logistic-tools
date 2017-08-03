/* global $, Parse, _, Materialize */
'use strict'

var regressionCoefficient = {
  "1": -0.7740124,
  "2": -0.2106657,
  "3": -0.4461743,
  "4": -0.4622263,
  "5": -1.927859,
  "6": -0.4901369,
  "7": 0.0200975,
  "8": 0.1001127,
  "9": -0.4945628,
  "10": -1.86643,
  "11": 0.4016888,
  "12": -0.8926396,
  "13": -1.153707,
  "year": 0.0100157,
  "deal_size": 0.0026842,
  "exclusive": 0.43887,
  "worldwide": 0.1059374,
  "lninnov_emp": -0.010692,
  "innov_private": 0.0247279,
  "lnpart_emp": 0.0925521,
  "partner_private": 0.1052217,
  "alliance_experience": 0.0115093,
  "i_judicial_efficacy": 0.0038181,
  "p_judicial_efficacy": 0.0065467,
  "relative_industry_exp": 0.001042,
  "diff_country": 0.1255628,
  "bio_to_other": 0.3797248,
  "risk": -1.67063,
  "npd_cycle": -0.1679328,
  "_cons": -20.81038
}

function computePercentage(params) {
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
  return output
}

$.fn.serializeObject = function () {
  var o = {}
  var a = this.serializeArray()
  $.each(a, function () {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]]
      }
      o[this.name].push(this.value || '')
    } else {
      o[this.name] = this.value || ''
    }
  })
  return o
}

$(function () {
  $('select').material_select()
  $('label').css('color', 'black')
  $('.select-dropdown').css('color', 'rgb(100,100,100)')
  // console.log($('.select-dropdown'))
  $('.modal-trigger').leanModal()
  $('.input-year').prop('max', new Date().getFullYear())
  $('.input-year').prop('value', new Date().getFullYear())
  $('.range-field input').on('input', function (e) {
    var value = e.target.value
    $(this).parent().find('.value').html(value)
  })
  $('#calculate-button').on('click', function (e) {
    var serializedForm = $('form').serializeObject()
    var formattedData = {
      year: Math.floor(serializedForm.allianceFormedYear),
      deal_size: Math.floor(serializedForm.dealSize),
      lninnov_emp: Math.log(Math.floor(serializedForm.innovatorEmployeeCount)),
      lnpart_emp: Math.log(Math.floor(serializedForm.partnerEmployeeCount)),
      alliance_experience: Math.floor(serializedForm.partnerExperience),
      relative_industry_exp: -Math.floor(serializedForm.partnerFoundYear) + Math.floor(serializedForm.innovatorFoundYear),
      risk: Math.floor(serializedForm.risk) / 100,
      npd_cycle: Math.floor(serializedForm.npdCycleStages),
      exclusive: serializedForm.dealExclusivity ? 1 : 0,
      worldwide: serializedForm.worldwideCoverage ? 1 : 0,
      innov_private: serializedForm.innovatorPublicPrivate ? 1 : 0,
      partner_private: serializedForm.partnerPublicPrivate ? 1 : 0,
      diff_country: serializedForm.innovatorCountry !== serializedForm.partnerCountry ? 1 : 0,
      bio_to_other: !serializedForm.partnerBiotech && serializedForm.innovatorBiotech ? 1 : 0,
      _cons: 1,
      i_judicial_efficacy: $.countriesScore[serializedForm.innovatorCountry],
      p_judicial_efficacy: $.countriesScore[serializedForm.partnerCountry]
    }
    var shouldContinue = true
    _.each(formattedData, function (value, key) {
      if (isNaN(value) || value === Number.NEGATIVE_INFINITY) {
        // console.log(key)
        Materialize.toast('Form not completed!', 4000)
        shouldContinue = false
        return false
      }
    })
    // console.log(formattedData)
    if (!shouldContinue) return
    var result = computePercentage(formattedData);
    // console.log(result)
    var successPercentage = Math.round(result * 1000) / 10
    var failurePercentage = Math.round((100 - successPercentage) * 10) / 10
    $('#result-display').html(successPercentage)
    $('#result-failure-display').html(failurePercentage)
    $('#result-modal').openModal()
  })
})
