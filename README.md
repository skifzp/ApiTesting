# ApiTesting
Install dependencies:
	yarn install

Run only tests in api\tests\cloud\setDeviceName\setDeviceName.api.js:
	yarn test:api --env=cmos --tags=cloud

Run security tests ( invalid-auth.api.js, unauthorized.api.js ):
	yarn test:api --env=cmos --tags=security
