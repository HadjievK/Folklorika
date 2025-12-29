interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-white border rounded-lg p-6 ${
        hover ? 'hover:shadow-lg transition' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
