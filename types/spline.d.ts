/// <reference types="react" />

declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      url?: string;
      loading?: string;
      'aria-label'?: string;
      onLoad?: (event: Event) => void;
      onError?: (event: Event) => void;
    };
  }
}
