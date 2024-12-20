import JRGAuthRouter from 'jrgcomponents/AuthRouter';
export default function AuthRouter(props) {
  return (
    <JRGAuthRouter
      {...props}
      corePagesConfig={{
        login: {
          showPassword: false,
          additionalFields: ['first_name', 'last_name'],
          path: '/login',
          heading: 'Please Authenticate',
        },
      }}
    />
  );
}
