const db = require("../config/db");

exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE deleted_at IS NULL"
    );

    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    // Basic validation
    if (!name || price == null) {
      return res.status(400).json({
        message: "Name and price are required"
      });
    }

    const [result] = await db.query(
      "INSERT INTO products (name, price) VALUES (?, ?)",
      [name, price]
    );

    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const [result] = await db.query(
      "UPDATE products SET name = ?, price = ? WHERE id = ? AND deleted_at IS NULL",
      [name, price, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found or already deleted"
      });
    }

    res.status(200).json({
      message: "Product updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE products SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found or already deleted"
      });
    }

    res.status(200).json({
      message: "Product soft deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE products SET deleted_at = NULL WHERE id = ? AND deleted_at IS NOT NULL",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found or not deleted"
      });
    }

    res.status(200).json({
      message: "Product restored successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};
