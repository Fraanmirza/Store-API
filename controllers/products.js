const product = require("../models/product");

const getAllProductStatic = async (req, res) => {
  const products = await product.find({ featured: true }).sort("name -price");
  res.status(200).json({ products, ndHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|<=|>|>=|=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const option = ["price", "ratings"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (option.includes(field)) {
        //sqaure bracket notation is used here
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  console.log(queryObject);
  let result = product.find(queryObject);
  //sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const filedsList = fields.split(",").join(" ");
    result = result.select(filedsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  //final call to get result
  const products = await result;

  res.status(200).json({ products, ndHits: products.length });
};

module.exports = {
  getAllProductStatic,
  getAllProducts,
};
