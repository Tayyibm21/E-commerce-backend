const { Router } = require("express");

const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

const router = Router();

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const getCategories = await Category.findAll({
      include: {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    });

    if (!getCategories) {
      return res.status(404).json({ message: "No Categories found" });
    }

    return res.json(getCategories);
  } catch (error) {
    console.error(`[ERROR]: Failed to get categories | ${error.message}`);
    return res.status(500).json({ error: "Failed to get categories" });
  }
});

router.get("/:id", async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const getCategory = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
        },
      ],
    });

    if (!getCategory) {
      return res.status(404).json({ message: "No get category Id found" });
    }

    return res.json(getCategory);
  } catch (error) {
    console.error(`[ERROR]: Failed to get category | ${error.message}`);
    return res.status(500).json({ error: "Failed to get category" });
  }
});

router.post("/", async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    return res.json(newCategory);
  } catch (error) {
    console.error(`[ERROR]: Failed to create category | ${error.message}`);
    return res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "No category found" });
    }

    await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    return res.json({ message: "Successfully updated category" });
  } catch (error) {
    console.error(`[ERROR]: Failed to update category | ${error.message}`);
    return res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "No category found" });
    }

    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json({ message: "Successfully deleted category" });
  } catch (error) {
    console.error(`[ERROR]: Failed to delete category | ${error.message}`);
    return res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = router;