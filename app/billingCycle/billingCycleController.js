angular.module('primeiraApp').controller('BillingCycleCtrl', [
  '$scope',
  '$http',
  '$location',
  'msgs',
  'tabs',
  'consts',
  BillingCycleController
])

function BillingCycleController($scope, $http, $location, msgs, tabs, consts) {

  $scope.getBillingCycles = function() {
    const page = parseInt($location.search().page) || 1
    const url = `${consts.apiUrl}/billingCycles?skip=${(page - 1) * 10}&limit=10`
    $http.get(url).then(function(resp) {
      $scope.billingCycles = resp.data
      $scope.billingCycle = {}
      initCreditsAndDebts()
      $http.get(`${consts.apiUrl}/billingCycles/count`).then(function(resp) {
        $scope.pages = Math.ceil(resp.data.value / 10)
        tabs.show($scope, {tabList: true, tabCreate: true})
      })
    })
  }

  $scope.createBillingCycle = function() {
    const url = `${consts.apiUrl}/billingCycles`;
    $http.post(url, $scope.billingCycle).then(function(response) {
      $scope.billingCycle = {}
      initCreditsAndDebts()
      $scope.getBillingCycles()
      msgs.addSuccess('Operação realizada com sucesso!!')
    }).catch(function(resp) {
      msgs.addError(resp.data.errors)
    })
  }

  $scope.showTabUpdate = function(billingCycle) {
    $scope.billingCycle = billingCycle
    initCreditsAndDebts()
    tabs.show($scope, {tabUpdate: true})
  }

  $scope.updateBillingCycle = function() {
    const url = `${consts.apiUrl}/billingCycles/${$scope.billingCycle._id}`
    $http.put(url, $scope.billingCycle).then(function(response) {
      $scope.billingCycle = {}
      initCreditsAndDebts()
      $scope.getBillingCycles()
      tabs.show($scope, {tabList: true, tabCreate: true})
      msgs.addSuccess('Operação realizada com sucesso!')
    }).catch(function(resp) {
      msgs.addError(resp.data.errors)
    })
  }

  $scope.showTabDelete = function(billingCycle) {
    $scope.billingCycle = billingCycle
    initCreditsAndDebts()
    tabs.show($scope, {tabDelete: true})
  }

  $scope.deleteBillingCycle = function() {
    const url = `${consts.apiUrl}/billingCycles/${$scope.billingCycle._id}`
    $http.delete(url, $scope.billingCycle).then(function(response) {
       $scope.billingCycle = {}
       initCreditsAndDebts()
       $scope.getBillingCycles()
       tabs.show($scope, {tabList: true, tabCreate: true})
       msgs.addSuccess('Operação realizada com sucesso!')
    }).catch(function(resp) {
       msgs.addError(resp.data)
    })
  }

  $scope.addDebt = function(index) {
    $scope.billingCycle.debts.splice(index + 1, 0, {})
  }

  $scope.cloneDebt = function(index, {name, value, status}) {
    $scope.billingCycle.debts.splice(index + 1, 0, {name, value, status})
    initCreditsAndDebts()
  }

  $scope.deleteDebt = function(index) {
    $scope.billingCycle.debts.splice(index, 1)
    initCreditsAndDebts()
  }

  $scope.addCredit = function(index) {
    $scope.billingCycle.credits.splice(index + 1, 0, {name: null, value: null})
  }

  $scope.cloneCredit = function(index, {name, value}) {
    $scope.billingCycle.credits.splice(index + 1, 0, {name, value})
    initCreditsAndDebts()
  }

  $scope.deleteCredit = function(index) {
    $scope.billingCycle.credits.splice(index, 1)
    initCreditsAndDebts()
  }

  $scope.cancel = function() {
    tabs.show($scope, {tabList: true, tabCreate: true})
    $scope.billingCycle = {}
    initCreditsAndDebts()
  }

  $scope.calculateValues = function() {
    $scope.credit = 0
    $scope.debt = 0

    if($scope.billingCycle) {
      $scope.billingCycle.credits.forEach(function({value}) {
        $scope.credit += !value || isNaN(value) ? 0 : parseFloat(value)
      })

      $scope.billingCycle.debts.forEach(function({value}) {
        $scope.debt += !value || isNaN(value) ? 0 : parseFloat(value)
      })
    }

    $scope.total = $scope.credit - $scope.debt
  }

  var initCreditsAndDebts = function() {
    if(!$scope.billingCycle.debts || !$scope.billingCycle.debts.length) {
      $scope.billingCycle.debts = []
      $scope.billingCycle.debts.push({})
    }

    if(!$scope.billingCycle.credits || !$scope.billingCycle.credits.length) {
      $scope.billingCycle.credits = []
      $scope.billingCycle.credits.push({})
    }

    $scope.calculateValues()
  }

  $scope.getBillingCycles()
}
