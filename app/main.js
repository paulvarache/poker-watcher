angular.module('watcher', ['poker', 'ngAnimate'])

.controller('MainController', ["$scope", function ($scope) {
    $scope.users = {};
    $scope.showed = false;
    var socket = io.connect("http://localhost:3000");
    socket.on('connect', function () {
        socket.emit('poker:watcher');
        $scope.$apply(function () {
            $scope.connected = true;
        });
    });
    socket.on('disconnect', function () {
        $scope.$apply(function () {
            $scope.connected = false;
        });
    });
    socket.on('poker:user', function (user) {
        $scope.$apply(function () {
            $scope.users[user.id] = user;
        });
    });
    socket.on('poker:show', function (results) {
        var total = 0;
        for (var key in results) {
            $scope.$apply(function () {
                $scope.users[results[key].id].choice = results[key].choice;
            });
        }
        $scope.$apply(function () {
            $scope.showed = true;
        });
        getAvg();
    });
    function getAvg () {
        var total = 0;
        for (var key in $scope.users) {
            total += $scope.users[key].choice;
        }
        $scope.$apply(function () {
            $scope.avg = Math.round(total / Object.keys($scope.users).length);
        });
    }
    socket.on('poker:choice', function (id) {
        $scope.$apply(function () {
            $scope.users[id].voted = true;
        });
    });
    socket.on('poker:cancelled', function (id) {
        $scope.$apply(function () {
            $scope.users[id].voted = false;
        });
    });
    socket.on('poker:watcher:init', function (infos) {
        $scope.$apply(function () {
            $scope.users = infos.users;
            $scope.showed = infos.turnEnded;
        });
        getAvg();
    });

    socket.on('poker:user:disconnected', function (id) {
        $scope.$apply(function () {
            delete $scope.users[id];
        });
        getAvg();
    });

    socket.on('poker:reset', function () {
        $scope.$apply(function () {
            $scope.showed = false;
            for (var key in $scope.users) {
                $scope.users[key].voted = false;
            }
        });
    });

    socket.on('poker:cancel', function (id) {
        $scope.$apply(function () {
            delete $scope.users[id].choice;
        });
    });
}]);