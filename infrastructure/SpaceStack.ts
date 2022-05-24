import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class SpaceStack extends Stack {
  private api = new RestApi(this, 'SpaceApi');

  // create a dynamo table for the space
  private spaceTable = new GenericTable('SpaceTable', 'spaceid', this);

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // nodejs hello lambda
    const helloNodeLambda = new NodejsFunction(this, 'helloNodeLambda', {
      entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
      handler: 'handler',
    });

    // hello api lambda integration
    const helloLambdaIntegration = new LambdaIntegration(helloNodeLambda);
    const helloLambdaResource = this.api.root.addResource('hello');
    helloLambdaResource.addMethod('GET', helloLambdaIntegration);
  }
}
