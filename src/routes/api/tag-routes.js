const { Router } = require("express");

const { Tag, Product } = require("../../models");

// The `/api/tags` endpoint

const router = Router();

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const getTags = await Tag.findAll({
      include: {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    });

    if (!getTags) {
      return res.status(404).json({ message: "No Tags found" });
    }

    return res.json(getTags);
  } catch (error) {
    console.error(`[ERROR]: Failed to get tags | ${error.message}`);
    return res.status(500).json({ error: "Failed to get tags" });
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const getTag = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
        },
      ],
    });

    if (!getTag) {
      return res.status(404).json({ message: "No get tag Id found" });
    }

    return res.json(getTag);
  } catch (error) {
    console.error(`[ERROR]: Failed to get tag | ${error.message}`);
    return res.status(500).json({ error: "Failed to get tag" });
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    return res.json(newTag);
  } catch (error) {
    console.error(`[ERROR]: Failed to create tag | ${error.message}`);
    return res.status(500).json({ error: "Failed to create tag" });
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "No tag found" });
    }

    await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    return res.json({ message: "Successfully updated tag" });
  } catch (error) {
    console.error(`[ERROR]: Failed to update tag | ${error.message}`);
    return res.status(500).json({ error: "Failed to update tag" });
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "No tag found" });
    }

    await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json({ message: "Successfully deleted tag" });
  } catch (error) {
    console.error(`[ERROR]: Failed to delete tag | ${error.message}`);
    return res.status(500).json({ error: "Failed to delete tag" });
  }
});

module.exports = router;