import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default {
    readAllProduct: async () => {
        try {
            return await prisma.products.findMany()
                .then(res => {
                    return {
                        status: true,
                        message: "Get all products successfullly!! ",
                        data: res
                    }
                })
                .catch(err => {
                    return {
                        status: false,
                        message: "Get all products falid!! ",

                    }
                })
        } catch (err) {
            return {
                status: false,
                message: "Lỗi không xác định!"
            }
        }
    },
    readProductById: async (productId) => {
        try {
            let product = await prisma.products.findUnique({
                where: {
                    id: productId
                }
            })
            return {
                status: true,
                message: "get product by id successfully!",
                data: product
            }
        } catch (err) {
            return {
                status: false,
                message: "Lỗi không xác định!"
            }
        }
    },
    create: async function (newProduct) {
        try {
            const product = await prisma.products.create({
                data: newProduct
            })
            return {
                status: true,
                message: "Thêm sản phẩm thành công!",
                data: product
            }
        } catch (err) {
           
            return {
                status: false,
                message: "Lỗi không xác định!"
            }
        }
    },
    update: async function (productId, productEditData) {

        try {
            const productEdited = await prisma.products.update({
                where: {
                    id: productId
                },
                data: productEditData
            })
            return {
                status: true,
                message: "update san pham thanh cong",
                data: productEdited
            }
        } catch (err) {
      
            return {
                status: false,
                message: "Lỗi không xác định!"
            }
        }
    },
    //search
    findMany: async function () {
        try {
            let products = await prisma.products.findMany();
            return {
                status: true,
                message: "san pham duoc tim thay!",
                data: products
            }
        } catch (err) {
            return {
                status: false,
                message: "lỗi!"
            }
        }
    },
    searchByName: async function (searchString) {
        try {
            let products = await prisma.products.findMany({
                where: {
                    name: {
                        contains: searchString,
                    }
                }
            });
            return {
                status: true,
                message: "Ket qua search",
                data: products
            }
        } catch (err) {
            return {
                status: false,
                message: "lỗi!"
            }
        }
    },
}