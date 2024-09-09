const Products = require("../models/productModel");

// FILTERING, SORTING, AND PAGINATION
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };
    console.log(queryObj);

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach(el => delete(queryObj[el]));
    console.log(queryObj); // DELETE HONE KE BAAD PAGE SORT LIMIT HTT JYGA

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => "$" + match);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join("");
      this.query = this.query.sort(sortBy);
      console.log(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

const productCtrl = {
  getProduct: async (req, res) => {
    try {
      console.log(req.query);
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .pagination();
      const products = await features.query;

      res.json({ result: products.length, products: products });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createProduct: async (req, res) => {
    try {
        // console.log("Form data received:");
        // console.log("req.body:", req.body);
        // console.log("req.file:", req.file);

        const { product_id, title, price, description, content, category } = req.body;
        if (!req.file) {
            console.error("No file uploaded");
            return res.status(400).json({ msg: "No Image Uploaded" });
        }

        const images = req.file.path;
        const product = await Products.findOne({ product_id });

        if (product) {
            console.error("Product already exists");
            return res.status(400).json({ msg: "This Product Already Exist" });
        }

        const newProduct = new Products({
            product_id,
            title: title.toLowerCase(),
            price,
            description,
            content,
            images,
            category
        });

        await newProduct.save();
        res.json({ msg: "Created a new product" });
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({ msg: err.message });
    }
},


  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a Product" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;
      if (!images) return res.status(400).json({ msg: "No Image Uploaded" });

      await Products.findByIdAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );

      res.json({ msg: "Updated a product" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productCtrl;
