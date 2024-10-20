# NextJS Boilerplate

This boilerplate provides a solid foundation for building NextJS applications with a focus on maintainability, scalability, and developer experience. It heavily utilizes `jrgcomponents` for various UI and functional components.

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Project Structure

- `app/`: Contains the main application code
- `components/`: Reusable React components
- `lib/`: Utility functions and helpers
- `public/`: Static assets

## Key Features

- NextJS 14 with App Router
- TypeScript support
- Tailwind CSS for styling
- ESLint and Prettier for code quality
- Storybook for component development
- Docker support for easy deployment

## Building on the Boilerplate

### Adding New Pages

Create new pages in the `app` directory. NextJS will automatically create routes based on the file structure.

Example:
```typescript
// app/about/page.tsx
export default function AboutPage() {
  return <h1>About Us</h1>
}
```

### Creating Components

1. Add new components in the `components/` directory
2. Utilize `jrgcomponents` where possible for consistency and efficiency

Example:
```typescript
// components/MyNewComponent.tsx
import { Button } from 'jrgcomponents/Button';

export function MyNewComponent() {
  return <Button>Click Me</Button>;
}
```

### Styling

This boilerplate uses Tailwind CSS. Add custom styles in `app/globals.css`.

### State Management

This boilerplate uses a combination of React's built-in state management features and custom hooks provided by `jrgcomponents`. Here's an overview of how state is managed:

1. **Local Component State**: For simple component-level state, use React's `useState` hook.

   Example:
   ```typescript
   import { useState } from 'react';

   function Counter() {
     const [count, setCount] = useState(0);
     return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
   }
   ```

2. **Context API**: For sharing state across multiple components, the project uses React's Context API. This is particularly evident in the authentication and theming systems.

   Example of using a context (from `jrgcomponents`):
   ```typescript
   import { useAuthentication } from 'jrgcomponents/AuthRouter';

   function MyComponent() {
     const authConfig = useAuthentication();
     // Use authConfig...
   }
   ```

3. **Custom Hooks**: The project leverages custom hooks, many of which are provided by `jrgcomponents`, for managing more complex state and side effects.

   Example:
   ```typescript
   import { useTheme } from 'jrgcomponents/useTheme';

   function ThemeAwareComponent() {
     const { currentTheme, setTheme } = useTheme();
     // Use theme state...
   }
   ```

4. **SWR for Data Fetching**: For server state and data fetching, the project uses SWR (Stale-While-Revalidate). This provides a simple and efficient way to handle remote data.

   Example:
   ```typescript
   import useSWR from 'swr';

   function Profile() {
     const { data, error } = useSWR('/api/user', fetcher);
     if (error) return <div>Failed to load</div>;
     if (!data) return <div>Loading...</div>;
     return <div>Hello {data.name}!</div>;
   }
   ```

When building on this boilerplate, consider these approaches for state management:

- Use local state (`useState`) for simple, component-specific state.
- Utilize Context API for state that needs to be shared across multiple components.
- Leverage custom hooks from `jrgcomponents` for complex state logic.
- Use SWR for managing server state and API calls.

## Important Functions and Utilities

- `cn()`: Utility function for constructing className strings (found in `lib/utils.ts`)
- `useTheme()`: Custom hook for accessing and modifying the current theme (from `jrgcomponents`)

## Environment Variables

Configure environment variables in `.env.local` for local development. Key variables include:

- `NEXT_PUBLIC_APP_NAME`: The name of your application
- `NEXT_PUBLIC_APP_URI`: The URI of your application
- `NEXT_PUBLIC_AUTH_WEB`: Authentication web address
- `NEXT_PUBLIC_AUTH_SERVER`: Authentication server address

Refer to the `docs/README.md` for a complete list of available environment variables.

## Using jrgcomponents

This boilerplate heavily relies on `jrgcomponents` for various UI elements and functionalities. Some key components include:

- `AppWrapper`: Main application wrapper (`jrgcomponents/Wrapper`)
- `Header`: Application header (`jrgcomponents/Header`)
- `AuthRouter`: Handles authentication routing (`jrgcomponents/AuthRouter`)
- `ThemeToggle`: Theme switching component (`jrgcomponents/Theming/ThemeToggle`)

To use these components, import them from `jrgcomponents` as needed in your files.

## Customization

### Theming

Customize the theme in `app/theme.ts`. The boilerplate uses a combination of Tailwind CSS and `jrgcomponents` theming capabilities.

### Layout

Modify the main layout in `app/layout.tsx`. This file sets up the overall structure of your application.

## Development Workflow

1. Create new components and pages as needed
2. Use Storybook (`npm run storybook`) to develop and test components in isolation
3. Implement business logic and integrate with backend services
4. Run linting and formatting: `npm run fix`
5. Test your application thoroughly
6. Build for production: `npm run build`
