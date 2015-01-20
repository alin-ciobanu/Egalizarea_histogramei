
var app = angular.module('jpeg', []);

var saveImage = function (data, fileName, fileType) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    var blob = new Blob([data], {type: fileType}),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

app.controller('UploadController', [
'$scope', 'FileUpload', '$http',
function ($scope, FileUpload, $http) {

    $scope.image = {
        data: null
    };

    $scope.status = {
        error: false,
        message: '',
        inProgress: false
    };

    $scope.uploadImage = function () {
        $scope.status.error = false;
        $scope.status.inProgress = true;
        FileUpload.uploadFile($scope.image.data,
        function (data) {

            saveImage(data, "output.jpg", "image/jpeg");
            $scope.status.inProgress = false;

        },
        function (response) {

            $scope.status.error = true;
            $scope.status.message = response.message;
            $scope.status.inProgress = false;

        });
    }

}
])

.service('FileUpload', ['$http', function ($http) {

    this.uploadFile = function(file, onSuccess, onError){

        var fd = new FormData();
        fd.append('file', file);

        $http.post('/api/uploadImage', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){

            $http.post('/api/downloadImage', {path: data.file}, {
                responseType : "blob"
            })
                .success(function (data) {
                    if (typeof onSuccess == 'function') {
                        onSuccess(data);
                    }
                });

            $http.post('/api/downloadImage', {path: data.histFile + "_before.png"}, {
                responseType : "blob"
            })
                .success(function (data) {
                    saveImage(data, "before.png", "image/png");
                });

            $http.post('/api/downloadImage', {path: data.histFile + "_after.png"}, {
                responseType : "blob"
            })
                .success(function (data) {
                    saveImage(data, "after.png", "image/png");
                });

        })
        .error(function(response){
            if (typeof onError == 'function') {
                onError(response);
            }
        });

    }
}])

.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);