(function() {

  angular.module('app')
         .factory('authToken',       authToken)
         .factory('authService',     authService)
         .factory('authInterceptor', authInterceptor);

  authToken.$inject       = ["$window"];
  authService.$inject     = ["$http", "$q", "authToken", "userDataService", "$state"];
  authInterceptor.$inject = ["$q", "$location", "authToken"];


  //||||||||||||||||||||||||||--
  // AUTH TOKEN FACTORY
  //||||||||||||||||||||||||||--
  function authToken($window) {
    var authTokenFactory = {};

    // get the token out of local storage
    authTokenFactory.getToken = function() {
      return $window.localStorage.getItem('token');
    };

    // function to set token or clear token
    // if a token is passed, set the token
    // if there is no token, clear it from local storage
    authTokenFactory.setToken = function(token) {
      if (token) {
        $window.localStorage.setItem('token', token);
      } else {
        $window.localStorage.removeItem('token');
      }
    };

    return authTokenFactory;
  }


  //||||||||||||||||||||||||||--
  // AUTH SERVICE FACTORY
  //||||||||||||||||||||||||||--
  function authService($http, $q, authToken, userDataService, $state) {

    // create auth factory object
    var authFactory = {},
        currentUser;

    // log a user in
    authFactory.login = function(email, password) {

      // return the promise object and its data
      return $http.post('/login', {
        email: email,
        password:    password
      })
        .success(function(data) {
          authToken.setToken(data.token);
          currentUser          = data.user;
          userDataService.user = data.user;

          return data;
        });
    };

    // log a user out by clearing the token
    authFactory.logout = function() {
      // clear the token
      authToken.setToken();

      // return to homepage
      $state.go('home');
    };

    // check if a user is logged in
    // checks if there is a local token
    authFactory.isLoggedIn = function() {
      if (authToken.getToken())
        return true;
      else
        return false;
    };

    authFactory.currentUser = function () {
      return currentUser;
    };

    // get the logged in user
    authFactory.getUser = function(id) {
      if (authToken.getToken())
        return $http.get('/users/' + id, { cache: true });
      else
        return $q.reject({ message: 'User has no token.' });
    };

    // return auth factory object
    return authFactory;
  }


  //||||||||||||||||||||||||||--
  // AUTH INTERCEPTOR FACTORY
  //||||||||||||||||||||||||||--
  function authInterceptor($q, $location, authToken) {
    var interceptorFactory = {};

    // this will happen on all HTTP requests
    interceptorFactory.request = function(config) {

      // grab the token
      var token = authToken.getToken();

      // if the token exists, add it to the header as x-access-token
      if (token) config.headers['x-access-token'] = token;

      return config;
    };

    // happens on response errors
    interceptorFactory.responseError = function(response) {

      // if our server returns a 403 forbidden response
      if (response.status == 403) {
        authToken.setToken();
        $location.path('/');
      }

      // return the errors from the server as a promise
      return $q.reject(response);
    };

    return interceptorFactory;
  }

})();
