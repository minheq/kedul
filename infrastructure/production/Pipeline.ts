import { CodePipeline, Fn, IAM, S3 } from 'cloudform';

const GithubOwner = 'minheq';
const GithubRepo = 'https://github.com/minheq/kedul';

// https://github.com/qswitcher/cloudformation_examples/blob/master/create_react_app.yml
export const DevOps = {
  CodePipeline: new CodePipeline.Pipeline({
    RoleArn: Fn.GetAtt('CodePipeLineRole', 'Arn'),
    ArtifactStore: {
      Location: Fn.Ref('PipelineBucket'),
      Type: 'S3',
    },
    Stages: [
      {
        Name: 'Source',
        Actions: [
          {
            Name: 'SourceAction',
            ActionTypeId: {
              Category: 'Source',
              Owner: 'ThirdParty',
              Provider: 'GitHub',
              Version: '1',
            },
            OutputArtifacts: [
              {
                Name: 'MyApp',
              },
            ],
            Configuration: {
              Owner: GithubOwner,
              Repo: GithubRepo,
              Branch: 'master',
              OAuthToken: '', // TODO: Add OAuthToken
            },
          },
        ],
      },
      {
        Name: 'Build',
        Actions: [
          {
            Name: 'BuildAction',
            ActionTypeId: {
              Category: 'Build',
              Owner: 'AWS',
              Provider: 'CodeBuild',
              Version: '1',
            },
            InputArtifacts: [
              {
                Name: 'MyApp',
              },
            ],
            OutputArtifacts: [
              {
                Name: 'MyAppBuild',
              },
            ],
            Configuration: {
              ProjectName: Fn.Ref('CodeBuild'),
            },
          },
        ],
      },
    ],
  }),
  CodePipeLineRole: new IAM.Role({
    AssumeRolePolicyDocument: {
      Version: '2012-10-17',
    },
    Policies: [
      {
        PolicyName: 'root',
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                's3:GetObject',
                's3:GetObjectVersion',
                's3:GetBucketVersioning',
                's3:PutObject',
              ],
              Resource: [
                Fn.GetAtt('PipelineBucket', 'Arn'),
                Fn.Join('', [Fn.GetAtt('PipelineBucket', 'Arn'), '/*']),
              ],
            },
            {
              Effect: 'Allow',
              Action: ['codebuild:BatchGetBuilds', 'codebuild:StartBuild'],
              Resource: '*',
            },
          ],
        },
      },
    ],
  }),
  PipelineBucket: new S3.Bucket({}),
};
