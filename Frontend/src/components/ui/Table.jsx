export default function Table({ columns, data, renderRow }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th key={col} className="text-left text-xs font-medium text-paragraph py-3 px-4">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = "" }) {
  return <td className={`py-3 px-4 text-sm ${className}`}>{children}</td>;
}
