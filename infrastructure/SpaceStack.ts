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
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class SpaceStack extends Stack {
  private api = new RestApi(this, 'SpaceApi');

  // create a dynamo table for the space
  private spaceTable = new GenericTable(this, {
    tableName: 'SpacesTable',
    parimaryKey: 'spaceid',
    createLambdaPath: 'Create',
  });

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // nodejs hello lambda
    const helloNodeLambda = new NodejsFunction(this, 'helloNodeLambda', {
      entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
      handler: 'handler',
    });

    // add a policy to the lambda to allow it to access the s3 bucket
    const s3ListBucketsPolicy = new PolicyStatement();
    s3ListBucketsPolicy.addActions('s3:ListAllMyBuckets');
    s3ListBucketsPolicy.addResources('*');
    helloNodeLambda.addToRolePolicy(s3ListBucketsPolicy);

    // hello api lambda integration
    const helloLambdaIntegration = new LambdaIntegration(helloNodeLambda);
    const helloLambdaResource = this.api.root.addResource('hello');
    helloLambdaResource.addMethod('GET', helloLambdaIntegration);

    // spaces api lambda integration
    const spaceResource = this.api.root.addResource('spaces');
    spaceResource.addMethod('POST', this.spaceTable.createLambdaIntegration);
  }
}
