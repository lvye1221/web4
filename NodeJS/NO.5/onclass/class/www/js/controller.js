/**
 * Created by liuyujing on 2017/2/13.
 */


angular.module("app.controller",[])
  .controller("homeController",function ($scope,getHomeList) {
      $scope.list = getHomeList.homeList;
  })
  .controller("homeDetaileController",function ($scope,getHomeList) {

    var urlList = location.href.split("/");
    var id = urlList[urlList.length-1];

    getHomeList.homeList.forEach(function (item) {
      console.log(item);

      if (item.id == id){
          $scope.info = item;
          return;
      }

    })

  })
  .controller("circleController",function ($scope,cookPage,$ionicPopup) {

    $scope.userID = window.localStorage.getItem("id");

    console.log($scope.userID);

    cookPage.searchAllCookPage(function (result) {

      var list = result.data.data;

      for (var i=0;i<list.length;i++){
        var info = list[i];

        info.images = info.images.split(",");
      }

      $scope.cookList = list;
      console.log($scope.cookList);
    });

    $scope.good = function (pageID,userID) {

      $scope.goodNum = 0;

      cookPage.takeGood(pageID,$scope.userID,1,function (result) {
        console.log(result);
        cookPage.getGoods(pageID,function (result) {
          console.log("点赞后:",result.data.data.length);
          $scope.goodNum = result.data.data.length;
        });
      });
    };

    $scope.cook = {};

    $scope.comment = {};
    $scope.showkboard = function (pageID) {
      $scope.cook.id = pageID;
      //显示/隐藏 键盘
      $scope.isShowKeyboard = !$scope.isShowKeyboard;
      console.log($scope.cook.id,$scope.isShowKeyboard);
    };

    $scope.toComment = function () {
      // cordova.plugins.Keyboard.show();

      cookPage.comment($scope.cook.id,$scope.comment.content,function (result) {
        console.log("评论的结果",result);
        $ionicPopup.alert({
          template: "提交成功"
        }).then(function () {
          $scope.isShowKeyboard = !$scope.isShowKeyboard;
        });
      });

    };


  })
  .controller("messageController",function ($scope) {

  })
  .controller("userController",function ($scope) {

  })
  .controller("userPostsController",function ($scope,$ionicNavBarDelegate) {

    $scope.back = function () {
      $ionicNavBarDelegate.back();
      // window.history.back();
    }

  })
  .controller("registerController",function ($scope,register) {

    $scope.user = {
      userInput:"",
      passwordInput:"",
      passwordInputAgain:"",
      birthdayInput:"",
      sex:false,
      phoneInput:""
    };

    //注册按钮 触发的方法
    $scope.toRegister = function () {
      var user = {
        username:$scope.user.userInput,
        password:$scope.user.passwordInputAgain,
        sex:$scope.user.sex,
        phone:$scope.user.phoneInput,
        birthday:$scope.user.birthdayInput
      };
      //调用 register 服务中  注册的方法
      register.gotoRegister(user);
    };

  })

  .controller("loginController",function ($scope,login,$ionicPopup, $timeout,$ionicLoading,$ionicNavBarDelegate) {

    $scope.user = {
      pipiNum:"",
        password:""
    };

    $scope.toLogin = function () {

      if($scope.user.pipiNum.length<=0){

        console.log("填写帐号");

        return;
      }

      $ionicLoading.show({
        template: '登录中...'
      });

      login.gotoLogin($scope.user,function (result) {

        var message = {
          title:"",
          des:""
        };
        console.log(result);

        if (result.data.code != 200){
          $ionicLoading.hide();
          $ionicPopup.alert({
            template: result.data.message
          });
          return;
        }

        if (result.data.data.length){
          var user = result.data.data[0];
          message.title = "伟大的"+user.username+"!";
          message.des = '欢迎回到皮皮虾菜谱';

          window.localStorage.setItem("username",user.username);
          window.localStorage.setItem("id",user.id);
          // window.localStorage.setItem("islogin",user.islogin);
          console.log("用户ID",window.localStorage.getItem("id"));

        }else {
          message.title = "帐号不存在";
          message.des = '请检查帐号信息';
        }

        $ionicLoading.hide();
        $ionicPopup.alert({
          title: message.title,
          template: message.des
        }).then(function () {
          if(message.title == "帐号不存在"){
            return;
          }
          $ionicNavBarDelegate.back();
        });

      });

    }

  });
