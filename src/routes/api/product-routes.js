const { Router } = require("express");

const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

const router = Router();

router.get("/", async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const getProducts = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "Category_name"],
        },
        {
          model: Tag,
          attributes: ["id", "Tag_name"],
        },
      ],
    });

    if (!getProducts) {
      return res.status(404).json({ message: "No Products found" });
    }

    return res.json(getProducts);
  } catch (error) {
    console.error(`[ERROR]: Failed to get products | ${error.message}`);
    return res.status(500).json({ error: "Failed to get products" });
  }
});

router.get("/:id", async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const getProduct = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "Category_name"],
        },
        {
          model: Tag,
          attributes: ["id", "Tag_name"],
        },
      ],
    });

    if (!getProduct) {
      return res.status(404).json({ message: "No 'Category by Id' found" });
    }
    return res.json(getProduct);
  } catch (error) {
    console.error(`[ERROR]: Failed to get product | ${error.message}`);
    return res.status(500).json({ error: "Failed to get product" });
  }
});

router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", async (req, res) => {
  // delete one product by its `id` value
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "No product found" });
    }

    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json({ message: "Successfully deleted product" });
  } catch (error) {
    console.error(`[ERROR]: Failed to delete product | ${error.message}`);
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;