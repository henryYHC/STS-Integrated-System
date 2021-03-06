'use strict';

module.exports = {
	db: 'mongodb://localhost/sts-integratedsystem',
	assets: {
		lib: {
			css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap-material-design/dist/css/roboto.min.css',
                'public/lib/bootstrap-material-design/dist/css/material.min.css',
                'public/lib/bootstrap-material-design/dist/css/ripples.min.css',
			],
			js: [
                'public/lib/jquery/dist/jquery.min.js',
                'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'public/lib/bootstrap-material-design/dist/js/ripples.min.js',
                'public/lib/bootstrap-material-design/dist/js/material.min.js',
                'public/lib/ng-file-upload/ng-file-upload.min.js',
                'public/lib/ng-file-upload/ng-file-upload-shim.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
