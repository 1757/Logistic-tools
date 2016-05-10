/* global $, Parse, _, Materialize */
'use strict'

Parse.initialize('myGLkXjxC4cZF0Rh0An1oxauXrE4AxsIXAhjrrMF', 'PqPreVmCfg2kYmVvTHqA6obkBmHDsRAR1QIQg4KM')

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
  console.log($('.select-dropdown'))
  $('.modal-trigger').leanModal()
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
        console.log(key)
        Materialize.toast('Form not completed!', 4000)
        shouldContinue = false
        return false
      }
    })
    console.log(formattedData)
    if (!shouldContinue) return
    Parse.Cloud.run('compute', formattedData, {
      success: function (result) {
        console.log(result)
        var successPercentage = Math.round(result * 1000) / 10
        var failurePercentage = Math.round((100 - successPercentage) * 10) / 10
        $('#result-display').html(successPercentage)
        $('#result-failure-display').html(failurePercentage)
        $('#result-modal').openModal()
      },
      error: function (error) {
        Materialize.toast(error.code + ': ' + error.message)
      }
    })
  })
})

$(window).load(function () {
  // Run code
});