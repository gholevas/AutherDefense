'use strict';

app.directive('signin', function () {
	return {
		scope: {
			userInfo: '=',
			text: '@',
			submit: '&'
		},
		templateUrl: '/components/signin/signin.html'
	}
});