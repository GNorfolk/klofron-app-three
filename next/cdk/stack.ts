import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const viewerRequestLambda = new lambdanodejs.NodejsFunction(this, 'ka3-nextjs', {
      // entry: '.serverless_nextjs/api-lambda/index.js',
      runtime: lambda.Runtime.NODEJS_16_X,
      // logRetention: 14,
      handler: "../index.handler",
      bundling: {
        minify: true,
        define: {
          'process.env.SOME_PARAM': "someParam",
          'process.env.ANOTHER_PARAM': "anotherParam",
        }
      },
      // AWS_NODEJS_CONNECTION_REUSE_ENABLED environment variable defaults to true, but must be removed for Lambda@Edge compatibility
      // otherwise you'll see a warning during synth
      awsSdkConnectionReuse: false,
    });
  }
}
