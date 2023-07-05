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
create database `klofron-app-three`;
use klofron-app-three;
CREATE TABLE `family` (
    `id` int primary key NOT NULL AUTO_INCREMENT,
    `name` varchar(155) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
insert into family (name) VALUES ('Halpert');
insert into family (name) VALUES ('Schrute');
CREATE TABLE `household` (
    `id` int primary key NOT NULL AUTO_INCREMENT,
    `name` varchar(155) NOT NULL,
    `food` int NOT NULL DEFAULT 0,
    `coin` int NOT NULL DEFAULT 0,
    `wood` int NOT NULL DEFAULT 0,
    `family_id` int NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (`family_id`) REFERENCES family(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
insert into household (name, family_id) VALUES ('The Halperts', 1);
insert into household (name, family_id) VALUES ('The Schrutes', 2);

CREATE TABLE `house` (
    `id` int primary key NOT NULL AUTO_INCREMENT,
    `name` varchar(155) NOT NULL,
    `storage` int NOT NULL DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `person` (
    `id` int primary key NOT NULL AUTO_INCREMENT,
    `name` varchar(155) NOT NULL,
    `family_id` int NOT NULL,
    `gender` varchar(155) NOT NULL,
    `household_id` int NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (`family_id`) REFERENCES family(`id`),
    FOREIGN KEY (`household_id`) REFERENCES household(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
insert into person (name, family_id, gender, household_id, created_at) VALUES ('Jim', 1, 'male', 1, date_sub(now(), interval 42 day));
insert into person (name, family_id, gender, household_id, created_at) VALUES ('Pam', 1, 'female', 1, date_sub(now(), interval 39 day));
insert into person (name, family_id, gender, household_id, created_at) VALUES ('Cecelia', 1, 'female', 1, date_sub(now(), interval 5 day));
insert into person (name, family_id, gender, household_id, created_at) VALUES ('Phillip', 1, 'male', 1, date_sub(now(), interval 2 day));
insert into person (name, family_id, gender, household_id, created_at) VALUES ('Dwight', 2, 'male', 2, date_sub(now(), interval 48 day));
insert into person (name, family_id, gender, household_id, created_at) VALUES ('Angela', 2, 'female', 2, date_sub(now(), interval 39 day));
insert into person (name, family_id, gender, household_id, created_at) VALUES ('Philip', 2, 'male', 2, date_sub(now(), interval 2 day));
```

**How to start next server:**
- Next: npm run dev
- Node: npm start

**How to create a new nodejs zip file:**
- zip -r nodejs.zip .

**How to deploy nextjs app:**
```bash
rm -rf .next .serverless* node_modules tf/image/node_modules tf/.terraform tf/.terraform.lock.hcl tf/react-app.zip tf/index.zip next-env.d.ts package-lock.json tf/image/package-lock.json
npm install
npm run deploy
npm --prefix tf/image install --platform=linux --arch=x64 tf/image
cp -R .next/serverless/ .serverless_nextjs/default-lambda/
terraform -chdir=tf init
terraform -chdir=tf apply -auto-approve
aws s3 sync --acl private .serverless_nextjs/assets/ s3://klofron-nextjs-app/
aws s3 sync --acl private .serverless_nextjs/assets/public/images/ s3://klofron-nextjs-image-original/images/
```

**How to deploy CFN app:**
- aws cloudformation package --template-file samTemplate.cf-template.yml --s3-bucket klofron-nextjs-deployment --output-template-file packaged-template.yaml
- aws cloudformation deploy --template-file /Users/g.norfolk/git/react-app/next/packaged-template.yaml --stack-name react-app --region eu-west-1 --capabilities CAPABILITY_IAM