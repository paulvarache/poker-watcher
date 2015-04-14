angular.module('poker', [])

.directive('pokerCard', function () {
    return {
        restrict: 'E',
        scope: '=',
        templateUrl: "app/card.template.html"
    }
})