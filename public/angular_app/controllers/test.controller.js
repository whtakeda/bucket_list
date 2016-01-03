 angular.module('app')
     .controller('TestController', function($scope) {
        $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 10 };
        $scope.options = {scrollwheel: false};
    });

