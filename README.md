# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Useful Links
- Setup doc: https://www.tutorialspoint.com/reactjs/reactjs_environment_setup.htm
- SSH key setup: https://www.baeldung.com/linux/ssh-private-key-git-command
- React learning: https://react.dev/learn
- Food lookup repo: https://github.com/fullstackreact/food-lookup-demo/tree/master
- AWS serverless tutorials: https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/
- AWS SAM and tf: https://aws.amazon.com/blogs/compute/better-together-aws-sam-cli-and-hashicorp-terraform/
- Lambda API repo: https://github.com/aws-samples/aws-sam-terraform-examples/tree/main/zip_based_lambda_functions/api-lambda-dynamodb-example
- Easy how-to-deploy nodejs on lambda: https://awstip.com/deploying-express-js-in-aws-lambda-b99c99ca7ad0
- NextJS serverless repo: https://github.com/serverless-nextjs/serverless-next.js
- NextJS startup guide: https://nextjs.org/learn/basics/create-nextjs-app
- NextJS getServerSideProps guide: https://www.slingacademy.com/article/next-js-using-getserversideprops-with-typescript/#The_Code
- Image processing docs: https://aws.amazon.com/blogs/networking-and-content-delivery/image-optimization-using-amazon-cloudfront-and-aws-lambda/
- Image processing repo: https://github.com/aws-samples/image-optimization
- NextJS serverless CDK code: https://github.com/serverless-nextjs/serverless-next.js/blob/master/packages/libs/lambda/src/deploy/cdktf/nextJsLambdaApp.ts
- Buttons interacting with state: https://nextjs.org/learn/foundations/from-javascript-to-react/adding-interactivity-with-state
- Tanstack React Query Docs: https://tanstack.com/query/latest/docs/react/overview
- Stack overflow open android dev tools: https://stackoverflow.com/questions/37256331/is-it-possible-to-open-developer-tools-console-in-chrome-on-android-phone
- Chrome docs for android dev tools: https://developer.chrome.com/docs/devtools/remote-debugging/
- Promises in nodejs lambda: https://stackoverflow.com/questions/54626183/whats-the-right-way-to-return-from-an-aws-lambda-function-in-node-js

# Development
**How to clone repo**:
- git clone git@github-personal:GNorfolk/klofron-app-three.git
Source: https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository

**How to setup next server:**
- npx create-next-app@latest next --use-npm --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"

**How to setup a basic database:**
```SQL
mysql.server start
mysql -h localhost -u root
CREATE DATABASE `klofron-app-three`;
USE klofron-app-three;
```

**How to reset database:**
```bash
mysql -u root -p klofron-app-three < starter-data.sql
mysql -u root -p klofron-app-three
```

**How to increment time for testing:**
- Make people older:
```sql
UPDATE person SET created_at = created_at - INTERVAL 1 DAY;
```
- Move forwards in time:
```sql
UPDATE person SET last_action = last_action - INTERVAL 8 HOUR;
```

**How to start next server:**
- Next: npm run dev
- Node: npm start

**How to create a new nodejs zip file:**
- zip -r nodejs.zip .

**How to deploy nextjs app:**
```bash
rm -rf .next .serverless .serverless_nextjs node_modules tf/.terraform tf/.terraform.lock.hcl tf/klofron-app-three-nextjs.zip next-env.d.ts package-lock.json
npm install
npm run deploy
cp -R .next/serverless/ .serverless_nextjs/default-lambda/
AWS_PROFILE=react-app terraform -chdir=tf init
AWS_PROFILE=react-app terraform -chdir=tf apply -auto-approve
AWS_PROFILE=react-app aws s3 sync --acl private .serverless_nextjs/assets/ s3://klofron-app-three-nextjs-app/
AWS_PROFILE=react-app aws cloudfront create-invalidation --distribution-id E1E0J1WWG2KPUY --invalidation-batch "{ \"Paths\": { \"Quantity\": 2, \"Items\": [ \"/\", \"/*\" ] }, \"CallerReference\": \"$(date +%s)\" }"
```

**How to deploy nodejs app:**
```bash
rm -rf node_modules tf/.terraform tf/.terraform.lock.hcl tf/klofron-app-three-nodejs.zip package-lock.json
npm install
AWS_PROFILE=react-app terraform -chdir=tf init
AWS_PROFILE=react-app terraform -chdir=tf apply -auto-approve
AWS_PROFILE=react-app aws lambda update-function-configuration --function-name klofron-app-three-nodejs --description $(date +%s) --region eu-west-1
AWS_PROFILE=react-app aws lambda update-function-configuration --function-name klofron-app-three-consumer --description $(date +%s) --region eu-west-1
```

**How to run consumer app locally:**
```bash
watch -n5 node consumer.js
```

**How to deploy CFN app:**
- aws cloudformation package --template-file samTemplate.cf-template.yml --s3-bucket klofron-nextjs-deployment --output-template-file packaged-template.yaml
- aws cloudformation deploy --template-file /Users/g.norfolk/git/react-app/next/packaged-template.yaml --stack-name react-app --region eu-west-1 --capabilities CAPABILITY_IAM
