import { useState, useMemo } from "react";

export default function Table({
  columns = [],
  data = [],
  searchable = true,
  initialSort = null
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(initialSort);

  // -----------------------------
  // Filtering Logic
  // -----------------------------
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.key];
        if (value === null || value === undefined) return false;
        return String(value)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, data, columns]);

  // -----------------------------
  // Sorting Logic (Stable)
  // -----------------------------
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const { key, direction } = sortConfig;

    return [...filteredData].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue === bValue) return 0;

      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      if (aValue < bValue) return direction === "asc" ? -1 : 1;

      return 0;
    });
  }, [filteredData, sortConfig]);

  // -----------------------------
  // Sort Handler
  // -----------------------------
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc"
        };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto" }}>
      {searchable && (
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            marginBottom: "12px",
            padding: "8px",
            width: "100%",
            maxWidth: "300px"
          }}
        />
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left"
        }}
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                style={{
                  padding: "10px",
                  borderBottom: "2px solid #ddd",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                {column.label}
                {sortConfig?.key === column.key && (
                  <span>
                    {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee"
                    }}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: "15px", textAlign: "center" }}
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
