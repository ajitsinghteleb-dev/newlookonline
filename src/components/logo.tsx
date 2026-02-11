export function Logo() {
  return (
    <div className="flex items-center justify-center" aria-label="LookOnline Global Logo">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2L2 7V17L4 16V8L12 13L20 8V16L22 17V7L12 2Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 22L4 17L12 12L20 17L12 22Z"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
      <span className="ml-3 text-xl font-headline font-bold text-foreground">
        LookOnline
      </span>
    </div>
  );
}
