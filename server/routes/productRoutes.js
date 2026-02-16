const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");

router.get("/products", controller.getProducts);
router.post("/products", controller.createProduct);
router.put("/products/:id", controller.updateProduct);
router.delete("/products/:id", controller.deleteProduct);
router.put("/products/:id/restore", controller.restoreProduct);


module.exports = router;
