import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const viewerRequestLambda = new lambdanodejs.NodejsFunction(this, 'ka3-nextjs', {
      entry: '.serverless_nextjs/api-lambda/index.js',
      runtime: lambda.Runtime.NODEJS_16_X,
      bundling: {
        minify: true,
        define: {
          'process.env.SOME_PARAM': "someParam",
          'process.env.ANOTHER_PARAM': "anotherParam",
        }
      },
      awsSdkConnectionReuse: false,
    });
  }
}
