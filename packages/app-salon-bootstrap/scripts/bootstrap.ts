import { bootstrap } from '../Bootstrap';

bootstrap().then(result => {
  const { user } = result;
  console.log('Data bootstrapped!');
  console.log(
    `Log in with phoneNumber ${
      user.account.phoneNumber
    } to have a user account with seeded data.`,
  );
  process.exit(0);
});
