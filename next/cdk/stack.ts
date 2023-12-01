import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const mrLambda = new lambda.Function(this, 'ka3-nextjs-two', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../.serverless_nextjs/default-lambda'), {
        // bundling: {
        //   image: cdk.DockerImage.fromRegistry('alpine'),
        //   environment: {
        //     'process.env.SOME_PARAM': "someParam",
        //     'process.env.ANOTHER_PARAM': "anotherParam",
        //   }
        // },
      }),
    });
    
    // const lambdaFunction = new lambda.Function(this, 'LambdaFunction', {
    //   code: lambda.Code.fromAsset('lambda'), 
    //   handler: 'index.handler',
    //   runtime: lambda.Runtime.NODEJS_16_X,
    //   // environment: {
    //   //   variables: {
    //   //     VAR1: 'value1',
    //   //     VAR2: 'value2'
    //   //   }.toString()
    //   // }
    // });
    
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
