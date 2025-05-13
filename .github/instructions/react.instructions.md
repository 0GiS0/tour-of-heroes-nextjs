# React Component Good Practices

1. **Use Functional Components**  
   Prefer functional components with hooks over class components.

2. **Keep Components Small**  
   Each component should do one thing well. Split large components into smaller, reusable ones.

3. **Use Props and State Properly**  
   Pass data via props and manage local state with hooks like `useState` and `useReducer`.

4. **Prop Types and Default Props**  
   Use TypeScript or PropTypes to type-check props.

5. **Avoid Side Effects in Render**  
   Use `useEffect` for side effects, not inside the render body.

6. **Use Meaningful Names**  
   Name components and props clearly to reflect their purpose.

7. **Destructure Props**  
   Destructure props in the function signature for clarity.

8. **Memoization**  
   Use `React.memo`, `useCallback`, and `useMemo` to optimize performance when needed.

9. **Accessibility**  
   Use semantic HTML and ARIA attributes for accessibility.

10. **Styling**  
    Use CSS Modules, styled-components, or other scoped styling solutions to avoid global CSS conflicts.

11. **Testing**  
    Write unit and integration tests for components.

12. **Avoid Inline Functions in JSX**  
    Define handlers outside of JSX to prevent unnecessary re-renders.

13. **Error Boundaries**  
    Use error boundaries to catch errors in the component tree.

14. **Use Keys in Lists**  
    Always provide a unique `key` prop when rendering lists.

15. **Clean Up Effects**  
    Return cleanup functions in `useEffect` to avoid memory leaks.
