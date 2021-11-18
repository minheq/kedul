# Contributing

## With Pre-Commit Review

Use this flow if you would like to receive a review on your contribution before it gets merged to main branch.

- Checkout a new branch. Name it `{feature,fix,chore}/name`
- Push the created branch to origin
- Create a Pull Request on GitHub
- Assign a Reviewer if not automatically done

The Pull Request will be checked against a test suite and reviewed, and once approved it will be merged to the main branch

## With Post-Commit Review

Use this flow if your are confident with your changes

- Ensure your main branch is up to date
- For every {feature,fix,chore} there should be a **single** commit (You can squash commits if you have multiple)
- Thoroughly test it locally
- Ensure changes are production quality and follows convention and code style
- Commit and name it `{feature,fix,chore}: description`
- Push the commit to main branch

Periodically we will review the code on main branch to identify rooms for improvement
