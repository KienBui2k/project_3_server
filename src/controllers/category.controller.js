import categoryModel from '../models/category.model';

export default {
    findByCategory: async function (req, res) {
        try {
            let result = await categoryModel.findByCategory(parseInt(req.params.category_id));

            return res.status(200).json({
                message: result.message,
                data: result.data
            })

        } catch (err) {
            return res.status(500).json({
                message: "Lỗi không xác định!"
            })
        }
    },
    findAllCategories: async (req, res) => {
        try {
            let modelRes = await categoryModel.findAll()

            return res.status(modelRes.status ? 200 : 214).json(modelRes)

        } catch (err) {
            return res.status(500).json(
                {
                    message: "Bad request products !"
                }
            )
        }
    },
    findLatestProductsByCategory: async (req, res) => {

        try {
            let categories = await categoryModel.findAll();
            let latestProductsByCategory = [];

            for (const category of categories.data) {
                console.log("category", category.title);
                let products = await categoryModel.findLatestProductsByCategory(category.id);

                latestProductsByCategory.push({
                    
                    category: category.title,
                    products: products.data
                });
            }
            return res.status(200).json({
                message: "Get latest products by category success!",
                data: latestProductsByCategory
            });
        } catch (err) {
            return res.status(500).json({
                message: "Lỗi không xác định!"
            });
        }
    }

}