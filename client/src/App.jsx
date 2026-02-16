import Table from "./components/Table";

function App() {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Product Name" },
    { key: "price", label: "Price" }
  ];

  const data = [
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Phone", price: 20000 },
    { id: 3, name: "Tablet", price: 30000 }
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h2>Advanced Reusable Table</h2>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default App;
